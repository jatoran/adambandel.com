// valadezfamily/script.js

let currentMonth = '';
let currentIndex = 0;
let currentAudioIndex = 0;
let slideshowInterval = null;
let isSlideshowPlaying = false;
let slideshowData = {};
let isInitialized = false;
let validImages = {};

const slideshowImage = document.getElementById('slideshow-image');
const pauseSlideshowButton = document.getElementById('play-pause-slideshow');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const audioElement = document.getElementById('background-audio');
const audioControlButton = document.getElementById('audio-control');
const currentMonthElement = document.getElementById('current-month');
// REMOVE monthList, monthNav, navLeft, navRight variables
// const monthList = document.getElementById('month-list'); // REMOVED
// const monthNav = document.querySelector('.month-nav'); // REMOVED
// const navLeft = document.querySelector('.nav-left'); // REMOVED
// const navRight = document.querySelector('.nav-right'); // REMOVED
const currentImageElement = document.getElementById('current-image');
const totalImagesElement = document.getElementById('total-images');
const PRELOAD_COUNT = 5; // Number of images to preload ahead

// Set to true if you want to check if all images in JSON exist
const ENABLE_PRELOAD = false;

function logImageCounts() {
    if (!validImages || Object.keys(validImages).length === 0) {
        console.warn("No valid images data to log yet.");
        return;
    }
    console.log("--- Valid Image Counts ---");
    for (const month in validImages) {
        console.log(`${month}: ${validImages[month].length} images`);
    }
     console.log("--------------------------");
}

function lazyLoadFirstImage() {
    if (slideshowImage && currentMonth && validImages[currentMonth] && validImages[currentMonth].length > 0) {
        const firstImagePath = validImages[currentMonth][0];
        console.log(`Lazy loading first image for ${currentMonth}: ${firstImagePath}`);
        const img = new Image();
        img.onload = () => {
            slideshowImage.src = firstImagePath;
            updateImageCounter();
            adjustImageSize();
            preloadImages(1); // Preload next images
        };
        img.onerror = () => {
            console.error(`Failed to lazy load first image: ${firstImagePath}`);
            // Optionally try the next image or display an error
        };
        img.src = firstImagePath;
    } else {
         console.warn(`Cannot lazy load first image for ${currentMonth}. Conditions not met.`);
         if (slideshowImage) {
             slideshowImage.alt = `No images available for ${currentMonth}`;
             slideshowImage.src = ''; // Clear image
         }
         updateImageCounter(); // Update counter to show 0/0 or similar
    }
}

// Update the loadSlideshowData function
async function loadSlideshowData() {
    // Prevent multiple initializations
    if (window.slideshowInitialized) {
         console.log("Slideshow already initialized.");
         return;
    }
    window.slideshowInitialized = true; // Set flag

    console.log("Loading slideshow data...");

    try {
        const response = await fetch('slideshow_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        slideshowData = await response.json();
        console.log("Slideshow data fetched:", slideshowData);

        await validateImages();
        logImageCounts(); // Log counts after validation

        // REMOVE setupMonthList() call
        // setupMonthList();

        // Determine initial month from hash or first valid entry
        let initialMonth = '';
        const hashMonth = decodeURIComponent(window.location.hash.slice(1));

        if (hashMonth && slideshowData[hashMonth]) {
            initialMonth = hashMonth;
        } else {
            // Find the first key in slideshowData that has valid images or is a video
             initialMonth = Object.keys(slideshowData).find(month =>
                (slideshowData[month].type === 'video') || (validImages[month] && validImages[month].length > 0)
            ) || ''; // Fallback to empty string if nothing found
        }

        console.log("Initial month determined as:", initialMonth || "None");

        if (!initialMonth) {
             if (Object.keys(slideshowData).length > 0) {
                 console.warn("No specific month in hash and first entry might be invalid/empty. Trying first key anyway.");
                 initialMonth = Object.keys(slideshowData)[0]; // Default to first key as last resort
             } else {
                  throw new Error("Slideshow data is empty.");
             }
        }

        if (!slideshowData[initialMonth]) {
             console.error(`Attempted initial month "${initialMonth}" not found in slideshowData.`);
             // Try falling back to the very first key if the derived initialMonth failed
             const firstKey = Object.keys(slideshowData)[0];
             if(firstKey && slideshowData[firstKey]) {
                 console.warn(`Falling back to first key: ${firstKey}`);
                 initialMonth = firstKey;
             } else {
                 throw new Error(`Invalid initial month: ${initialMonth} and no valid fallback.`);
             }
        }

        console.log("Setting initial month to:", initialMonth);
        // Use requestAnimationFrame to ensure DOM is ready for image update
        requestAnimationFrame(() => {
            setMonth(initialMonth); // Set month internally
            // lazyLoadFirstImage() is now called within setMonth
        });

        isInitialized = true; // Mark as initialized *inside* try block
        console.log('Slideshow initialized successfully');

    } catch (error) {
        console.error('Error loading slideshow data:', error);
        displayErrorMessage('Error loading slideshow. Please check data or refresh the page.');
        window.slideshowInitialized = false; // Reset flag on error
    }
}

function displayErrorMessage(message) {
    const container = document.getElementById('slideshow-container');
    if (container) {
        // Clear existing content and show error
        container.innerHTML = `<p class="error-message" style="padding: 20px; text-align: center;">${message}</p>`;
    } else {
        // Fallback if container isn't found
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.innerHTML = `<p class="error-message">${message}</p>`;
        } else {
             document.body.innerHTML += `<p class="error-message">${message}</p>`;
        }
    }
    // Also clear month display
     if (currentMonthElement) currentMonthElement.textContent = "Error";
}

async function validateImages() {
    console.log("Validating images...");
    validImages = {}; // Reset validation object
    for (const month in slideshowData) {
         if (slideshowData[month].type === 'video') {
            console.log(`${month}: Video entry, skipping image validation.`);
            // Store video info if needed, or just skip
             validImages[month] = []; // Keep structure consistent, even if empty for videos
            continue;
        }

        if (slideshowData[month].images && Array.isArray(slideshowData[month].images)) {
            const declaredCount = slideshowData[month].imageCount || slideshowData[month].images.length;
            const currentMonthImages = []; // Store valid images for this specific month

            // Use a Set to ensure unique images
            const uniqueImages = new Set();
            const duplicateImages = new Set();
            const missingImages = new Set(); // Only used if ENABLE_PRELOAD is true

             console.log(`Validating ${month}... Declared: ${declaredCount}, Found paths: ${slideshowData[month].images.length}`);

            const imageCheckPromises = slideshowData[month].images.map(async (imagePath) => {
                if (uniqueImages.has(imagePath)) {
                    duplicateImages.add(imagePath);
                    return null; // Skip duplicate
                }
                uniqueImages.add(imagePath);

                if (ENABLE_PRELOAD) {
                    try {
                        await preloadImage(imagePath);
                        return imagePath; // Return valid path
                    } catch (error) {
                        // console.error(`Failed to load image: ${imagePath}`, error); // Too noisy potentially
                        missingImages.add(imagePath);
                        return null; // Skip missing image
                    }
                } else {
                    // If not preloading, assume path is valid for now
                    return imagePath;
                }
            });

            const results = await Promise.all(imageCheckPromises);
            // Filter out null results (duplicates or missing images if preloading)
            currentMonthImages.push(...results.filter(path => path !== null));

            validImages[month] = currentMonthImages; // Assign the validated list

            // --- Logging ---
            if (duplicateImages.size > 0) {
                console.warn(`[${month}] Duplicate image paths found (${duplicateImages.size}):`, Array.from(duplicateImages));
            }
            if (ENABLE_PRELOAD && missingImages.size > 0) {
                console.warn(`[${month}] Missing/unloadable images (${missingImages.size}):`, Array.from(missingImages));
            }
            if (declaredCount !== validImages[month].length) {
                console.warn(`[${month}] Mismatch in image count. Declared: ${declaredCount}, Actual Valid: ${validImages[month].length}, Difference: ${Math.abs(declaredCount - validImages[month].length)}`);
            }
            // --- End Logging ---

        } else {
             console.warn(`No 'images' array found for month: ${month}`);
             validImages[month] = []; // Ensure entry exists even if empty/invalid
        }
    }
     console.log("Image validation complete.");
}

function adjustImageSize() {
    const img = document.querySelector('#slideshow img');
    const container = document.getElementById('slideshow-container');

    if (img && container && img.naturalWidth > 0 && img.naturalHeight > 0) { // Check natural dimensions
      const containerAspect = container.clientWidth / container.clientHeight;
      const imageAspect = img.naturalWidth / img.naturalHeight;

      // Reset styles first
      img.style.width = '';
      img.style.height = '';

      if (imageAspect > containerAspect) {
        // Image is wider than container aspect ratio -> fit width
        img.style.width = '100%';
        img.style.height = 'auto';
      } else {
        // Image is taller than container aspect ratio (or square) -> fit height
        img.style.width = 'auto';
        img.style.height = '100%';
      }
    } else if (img) {
         // Handle cases where image hasn't loaded dimensions yet or failed
         img.style.width = 'auto';
         img.style.height = 'auto'; // Or set a placeholder size/style
    }
  }

function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = (err) => {
            // Pass the error event or a message back
            reject(`Failed to load ${src}: ${err ? err.type : 'Unknown error'}`);
        }
        img.src = src;
    });
}

function updateImageCounter() {
    const currentMonthData = currentMonth ? validImages[currentMonth] : null;
    const numImages = currentMonthData ? currentMonthData.length : 0;

    if (currentImageElement && totalImagesElement) {
        currentImageElement.textContent = numImages > 0 ? currentIndex + 1 : 0;
        totalImagesElement.textContent = numImages;
    }

    // Image onload for adjustImageSize is handled within updateImage now
}

// REMOVE setupMonthList function entirely
/*
function setupMonthList() { ... } // REMOVED
*/

// REMOVE updateNavArrows function entirely
/*
function updateNavArrows() { ... } // REMOVED
*/

// REMOVE scrollNav function entirely
/*
function scrollNav(direction) { ... } // REMOVED
*/

// REMOVE event listeners for navLeft, navRight, and the resize listener for updateNavArrows
/*
if (navLeft) { ... } // REMOVED
if (navRight) { ... } // REMOVED
window.addEventListener('resize', updateNavArrows); // REMOVED
*/


function resetSlideshow() {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
    isSlideshowPlaying = false;
    if (pauseSlideshowButton) pauseSlideshowButton.innerHTML = '<i class="fas fa-play"></i>';
    if (audioElement) {
        if (!audioElement.paused) {
             audioElement.pause();
        }
        // Don't reset currentTime to 0 immediately, let setMonth handle loading new audio
    }
    // Keep audio muted state as user set it
    // if (audioControlButton) audioControlButton.innerHTML = audioElement.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>'; // Update based on actual muted state later
}


function moveToNextImage() {
    const currentMonthData = validImages[currentMonth];
    if (currentMonthData && currentMonthData.length > 0) {
        currentIndex = (currentIndex + 1) % currentMonthData.length;
        updateImage();
    }
}

function moveToPrevImage() {
    const currentMonthData = validImages[currentMonth];
     if (currentMonthData && currentMonthData.length > 0) {
        currentIndex = (currentIndex - 1 + currentMonthData.length) % currentMonthData.length;
        updateImage();
    }
}


class ImagePreloader {
    constructor() {
        this.cache = new Map(); // Stores Image objects
    }

    preload(imagePaths) {
        imagePaths.forEach(path => {
            if (!this.cache.has(path)) {
                const img = new Image();
                img.src = path; // Start loading
                this.cache.set(path, img); // Store the Image object immediately
            }
        });
    }

    // Optional: Method to check if an image is loaded (though updateImage handles this)
    isLoaded(path) {
        const img = this.cache.get(path);
        return img && img.complete && img.naturalWidth > 0;
    }

    getImage(path) {
        return this.cache.get(path);
    }

    clear() {
        this.cache.clear();
    }
}

const imagePreloader = new ImagePreloader();

function preloadImages(startIndex) {
    const currentMonthData = validImages[currentMonth];
    if (!currentMonthData || currentMonthData.length === 0) return; // No images to preload

    const imagesToLoad = [];
    const totalImages = currentMonthData.length;

    // Preload next PRELOAD_COUNT images, wrapping around
    for (let i = 1; i <= PRELOAD_COUNT; i++) { // Start from 1 (next image)
        const index = (startIndex + i) % totalImages;
        const imagePath = currentMonthData[index];
        // Check if not already cached OR if cached but failed to load previously
        const cachedImg = imagePreloader.getImage(imagePath);
        if (!cachedImg || (cachedImg && !cachedImg.complete)) {
            imagesToLoad.push(imagePath);
        }
    }

    if (imagesToLoad.length > 0) {
        // console.log(`Preloading images starting from index ${startIndex + 1}:`, imagesToLoad);
        imagePreloader.preload(imagesToLoad);
    }
}

// Intersection Observer logic removed as preloading is now proactive
// let observer;
// function setupIntersectionObserver() { ... } // REMOVED

function updateImage() {
    const currentMonthData = validImages[currentMonth];

    if (slideshowImage && currentMonthData && currentMonthData.length > 0) {
        // Ensure currentIndex is valid
        if (currentIndex < 0 || currentIndex >= currentMonthData.length) {
             console.warn(`Invalid currentIndex (${currentIndex}) for ${currentMonth}. Resetting to 0.`);
             currentIndex = 0;
        }

        const imagePath = currentMonthData[currentIndex];
        console.log(`Updating image to index ${currentIndex}: ${imagePath}`);

        // Clear previous image source to prevent showing stale image during load
        slideshowImage.src = ''; // Or a loading placeholder image
        slideshowImage.alt = `Loading ${currentMonth} image ${currentIndex + 1}...`;

        const preloadedImage = imagePreloader.getImage(imagePath);

        // Check if the image object exists and is complete (loaded successfully)
        if (preloadedImage && preloadedImage.complete && preloadedImage.naturalWidth > 0) {
            // console.log(`Using preloaded image: ${imagePath}`);
            slideshowImage.src = imagePath;
            slideshowImage.alt = `${currentMonth} image ${currentIndex + 1}`;
            updateImageCounter();
            adjustImageSize(); // Adjust size after src is set
            preloadImages(currentIndex); // Preload subsequent images
        } else {
            // Image not preloaded or failed preloading, load it now
            // console.log(`Loading image directly (not preloaded or failed): ${imagePath}`);
            const img = new Image(); // Create a new Image object for loading
            img.onload = () => {
                 // Check if we are still supposed to show this image (user might have clicked next/prev quickly)
                 if (currentMonthData[currentIndex] === imagePath) {
                     slideshowImage.src = imagePath;
                     slideshowImage.alt = `${currentMonth} image ${currentIndex + 1}`;
                     updateImageCounter();
                     adjustImageSize();
                     preloadImages(currentIndex); // Preload subsequent images
                     // Add to cache if it wasn't there or replace if failed before
                     imagePreloader.cache.set(imagePath, img);
                 } else {
                     console.log("Image loaded, but index/month changed. Ignoring load.");
                 }
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${imagePath}`);
                slideshowImage.alt = `Error loading image ${currentIndex + 1}`;
                // Optionally: Move to the next image automatically on error
                 if (currentMonthData[currentIndex] === imagePath) { // Only advance if error is for current expected image
                    console.warn("Attempting to move to next image due to load error.");
                    // Avoid infinite loops if all images fail
                    // A simple check: if the next index is the same as the failed one (only 1 image), stop.
                    const nextIndex = (currentIndex + 1) % currentMonthData.length;
                    if (nextIndex !== currentIndex) {
                        setTimeout(moveToNextImage, 100); // Small delay before moving
                    } else {
                         console.error("Single image failed to load or all images failed consecutively.");
                         displayErrorMessage(`Failed to load image for ${currentMonth}.`);
                    }
                 }
            };
            img.src = imagePath; // Start loading
        }
    } else if (slideshowImage) {
        // Handle case where there are no valid images for the current month
         console.warn(`No valid images to display for ${currentMonth}.`);
         slideshowImage.src = ''; // Clear image
         slideshowImage.alt = `No images available for ${currentMonth}`;
         updateImageCounter(); // Update counter to 0/0
    }
}


function setMonth(month) {
    // Allow setting month even if it's the same (e.g., from hash change event)
    // but only proceed if data exists for the month
    if (!slideshowData[month]) {
         console.error(`Attempted to set invalid month: ${month}`);
         // Optionally display an error or default to a valid month
         // displayErrorMessage(`Invalid month selected: ${month}`);
         // Find first valid month as fallback?
         const firstValidMonth = Object.keys(slideshowData).find(m => (slideshowData[m].type === 'video') || (validImages[m] && validImages[m].length > 0));
         if(firstValidMonth) {
             console.warn(`Falling back to first valid month: ${firstValidMonth}`);
             window.location.hash = encodeURIComponent(firstValidMonth); // Trigger hashchange to correct
         } else {
              displayErrorMessage("No valid months found in slideshow data.");
         }
         return; // Stop processing
    }

    console.log(`Setting month to: ${month}`);
    resetSlideshow(); // Stop existing slideshow/audio first
    currentMonth = month;
    currentIndex = 0; // Always reset index when changing month
    currentAudioIndex = 0; // Reset audio index too

    if (currentMonthElement) currentMonthElement.textContent = month;
    window.location.hash = encodeURIComponent(month); // Update hash

    // Handle Video Type
    if (slideshowData[month] && slideshowData[month].type === "video") {
        // We are likely already on rachel.html, but this ensures consistency if called directly
        // If NOT on rachel.html, navigate there.
        if (!window.location.pathname.includes('rachel.html')) {
            console.log(`Navigating to video page for ${month}`);
            window.location.href = "rachel.html"; // Assuming only Rachel uses video for now
        } else {
             // If already on rachel.html, just update title (already done)
             console.log(`Already on video page for ${month}.`);
             // Ensure slideshow container is hidden and video is visible if needed (handled by page structure)
        }
        return; // Stop further processing for video type
    }

    // Handle Image Slideshow Type
    if (validImages[month]) { // Check if validImages entry exists
        console.log(`Month ${month} has ${validImages[month].length} valid images.`);
        imagePreloader.clear(); // Clear cache for previous month
        updateImage(); // Display the first image (or placeholder if none)
        updateAudio(); // Load the first audio track
        updateImageCounter(); // Update counter display
    } else {
         console.error(`Logic error: validImages entry missing for month ${month} despite slideshowData existing.`);
         displayErrorMessage(`Error processing images for ${month}.`);
    }
}


function updateAudio() {
    if (!currentMonth || !slideshowData[currentMonth] || !slideshowData[currentMonth].audio || slideshowData[currentMonth].audio.length === 0) {
        console.log(`No audio defined for ${currentMonth}.`);
        if (audioElement) audioElement.src = ''; // Clear src if no audio
        return;
    }

     // Ensure audio index is valid
    if (currentAudioIndex < 0 || currentAudioIndex >= slideshowData[currentMonth].audio.length) {
        currentAudioIndex = 0;
    }

    const audioSrc = slideshowData[currentMonth].audio[currentAudioIndex];
    console.log(`Updating audio to track ${currentAudioIndex}: ${audioSrc}`);

    if (audioElement) {
        audioElement.src = audioSrc;
        audioElement.load(); // Explicitly load the new source

        // Update control button based on muted state AFTER loading new source
        if (audioControlButton) {
            audioControlButton.innerHTML = audioElement.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        }

         // If the slideshow is supposed to be playing, attempt to play audio
        if (isSlideshowPlaying) {
            // Delay play slightly to allow source loading
            setTimeout(() => {
                audioElement.play().catch(error => {
                    if (error.name === 'NotAllowedError') {
                         console.warn("Audio autoplay prevented. User interaction required.");
                         // Optionally, pause the visual slideshow too until user interacts
                         // toggleSlideshow(); // This would pause visually
                    } else {
                         console.error("Audio play failed:", error);
                    }
                });
            }, 100); // Adjust delay if needed
        }
    }
}


function moveToNextAudio() {
    if (!currentMonth || !slideshowData[currentMonth] || !slideshowData[currentMonth].audio || slideshowData[currentMonth].audio.length === 0) {
        return; // No audio or only one track
    }
    currentAudioIndex = (currentAudioIndex + 1) % slideshowData[currentMonth].audio.length;
    updateAudio(); // updateAudio handles loading and playing if necessary
}

function toggleSlideshow() {
    if (isSlideshowPlaying) {
        // Pause
        clearInterval(slideshowInterval);
        slideshowInterval = null;
        if (pauseSlideshowButton) pauseSlideshowButton.innerHTML = '<i class="fas fa-play"></i>';
        if (audioElement && !audioElement.paused) audioElement.pause();
        isSlideshowPlaying = false;
        console.log("Slideshow Paused");
    } else {
        // Play
        const currentMonthData = slideshowData[currentMonth];
        const interval = (currentMonthData && currentMonthData.interval) || 6000; // Default interval
        // Prevent multiple intervals if clicked rapidly
        if (slideshowInterval) clearInterval(slideshowInterval);
        slideshowInterval = setInterval(moveToNextImage, interval);
        if (pauseSlideshowButton) pauseSlideshowButton.innerHTML = '<i class="fas fa-pause"></i>';

        // Attempt to play audio only if not muted and source exists
        if (audioElement && !audioElement.muted && audioElement.src) {
             audioElement.play().catch(error => {
                if (error.name === 'NotAllowedError') {
                     console.warn("Audio autoplay prevented on play button click. User interaction might be needed again (e.g., unmute).");
                } else {
                     console.error("Audio play failed on toggle:", error);
                }
            });
        }
        isSlideshowPlaying = true;
        console.log("Slideshow Playing");
    }
}


// --- Event Listeners ---

if (pauseSlideshowButton) {
    pauseSlideshowButton.addEventListener('click', toggleSlideshow);
}

if (nextButton) {
    nextButton.addEventListener('click', () => {
        moveToNextImage();
        // Reset interval timer if slideshow is playing
        if (isSlideshowPlaying && slideshowInterval) {
            clearInterval(slideshowInterval);
            const interval = (slideshowData[currentMonth] && slideshowData[currentMonth].interval) || 6000;
            slideshowInterval = setInterval(moveToNextImage, interval);
        }
    });
}

if (prevButton) {
    prevButton.addEventListener('click', () => {
        moveToPrevImage();
        // Reset interval timer if slideshow is playing
        if (isSlideshowPlaying && slideshowInterval) {
            clearInterval(slideshowInterval);
            const interval = (slideshowData[currentMonth] && slideshowData[currentMonth].interval) || 6000;
            slideshowInterval = setInterval(moveToNextImage, interval);
        }
    });
}

if (audioControlButton) {
    audioControlButton.addEventListener('click', () => {
        if (audioElement) {
            audioElement.muted = !audioElement.muted;
            audioControlButton.innerHTML = audioElement.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
            console.log("Audio muted:", audioElement.muted);
        }
    });
}

if (audioElement) {
    // When audio ends, move to the next track if available
    audioElement.addEventListener('ended', () => {
        console.log("Audio track ended.");
        moveToNextAudio();
    });

    // Update mute button if muted state changes programmatically elsewhere
     audioElement.addEventListener('volumechange', () => {
         if (audioControlButton) {
            audioControlButton.innerHTML = audioElement.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
         }
     });
}

// Listen for hash changes to navigate between slideshows
window.addEventListener('hashchange', () => {
    console.log("Hash changed:", window.location.hash);
    const monthFromHash = decodeURIComponent(window.location.hash.slice(1));
    // Only set month if it's different from current or if not initialized yet
    if (monthFromHash && (monthFromHash !== currentMonth || !isInitialized)) {
         // Check if the target month actually exists in the data
         if (slideshowData[monthFromHash]) {
             setMonth(monthFromHash);
         } else {
              console.warn(`Hash changed to non-existent month: ${monthFromHash}. Ignoring.`);
              // Optional: redirect to index.html without hash or show an error
         }
    } else if (!monthFromHash && currentMonth) {
        // Hash cleared, maybe go back to the first default month?
        console.log("Hash cleared. Deciding action..."); // Decide what to do here - stay? go to default?
         const firstValidMonth = Object.keys(slideshowData).find(m => (slideshowData[m].type === 'video') || (validImages[m] && validImages[m].length > 0));
         if (firstValidMonth && firstValidMonth !== currentMonth) {
             console.log(`Hash cleared, navigating to first valid month: ${firstValidMonth}`);
             window.location.hash = encodeURIComponent(firstValidMonth); // This will trigger hashchange again
         }
    }
});

// Adjust image size on window resize
window.addEventListener('resize', adjustImageSize);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Initializing slideshow...");
    loadSlideshowData(); // Start loading data and setting up
    // REMOVE setupIntersectionObserver() call
    // setupIntersectionObserver();

    // Handle specific setup for rachel.html if needed (though setMonth logic covers it)
    if (window.location.pathname.includes('rachel.html')) {
         console.log("On Rachel's video page.");
         // The main loadSlideshowData will handle setting the month via hash or default logic
         // If hash is missing on rachel.html, we might need to force setMonth("Rachel's Video")
         if (!window.location.hash && slideshowData["Rachel's Video"]) {
             // This might run before slideshowData is loaded, better handle in setMonth or loadSlideshowData
         }
    }
});

// Safety net: Call loadSlideshowData again in case DOMContentLoaded already fired
// Use the flag to prevent multiple runs
if (document.readyState === 'complete' || document.readyState === 'interactive') {
     if (!window.slideshowInitialized) {
         console.log("DOM already ready, attempting initialization.");
         loadSlideshowData();
     }
}