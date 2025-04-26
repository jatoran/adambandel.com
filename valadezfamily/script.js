// valadezfamily/script.js

let currentMonth = '';
let currentIndex = 0;
let currentAudioIndex = 0;
let slideshowInterval = null;
let isSlideshowPlaying = false;
let slideshowData = {};
let isInitialized = false;
let validImages = {}; // Stores validated image paths per month

const slideshowImage = document.getElementById('slideshow-image');
const pauseSlideshowButton = document.getElementById('play-pause-slideshow');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const audioElement = document.getElementById('background-audio');
const audioControlButton = document.getElementById('audio-control');
const currentMonthElement = document.getElementById('current-month');
const currentImageElement = document.getElementById('current-image');
const totalImagesElement = document.getElementById('total-images');
const PRELOAD_COUNT = 5; // Number of images to preload ahead

// Set to true if you want to check if all images in JSON exist during validation
const ENABLE_PRELOAD_VALIDATION = false; // Renamed for clarity

function logImageCounts() {
    if (!validImages || Object.keys(validImages).length === 0) {
        console.warn("No valid images data to log yet.");
        return;
    }
    console.log("--- Valid Image Counts ---");
    for (const month in validImages) {
        // Only log counts for image types
        if (slideshowData[month]?.type === 'image' || !slideshowData[month]?.type) {
             console.log(`${month}: ${validImages[month].length} images`);
        }
    }
     console.log("--------------------------");
}

function lazyLoadFirstImage() {
    if (slideshowImage && currentMonth && validImages[currentMonth] && validImages[currentMonth].length > 0) {
        const firstImagePath = validImages[currentMonth][0];
        console.log(`Lazy loading first image for ${currentMonth}: ${firstImagePath}`);
        const img = new Image();
        img.onload = () => {
            // Check if the month is still the same before setting the src
            if(currentMonth === monthNameFromImagePath(firstImagePath)) { // Helper needed or refine logic
                 slideshowImage.src = firstImagePath;
                 updateImageCounter();
                 adjustImageSize();
                 preloadImages(1); // Preload next images
            } else {
                 console.log("First image loaded, but month changed. Ignoring.");
            }
        };
        img.onerror = () => {
            console.error(`Failed to lazy load first image: ${firstImagePath}`);
            // Optionally try the next image or display an error
            if(currentMonth === monthNameFromImagePath(firstImagePath)) {
                slideshowImage.alt = `Error loading image for ${currentMonth}`;
                updateImageCounter(); // Show 0/N
            }
        };
        img.src = firstImagePath;
    } else {
         console.warn(`Cannot lazy load first image for ${currentMonth}. No valid images found or element missing.`);
         if (slideshowImage) {
             slideshowImage.alt = `No images available for ${currentMonth}`;
             slideshowImage.src = ''; // Clear image
         }
         updateImageCounter(); // Update counter to show 0/0 or similar
    }
}

// Basic helper to extract month key assumption from path - refine if needed
function monthNameFromImagePath(path) {
    // Example: "assets/images/2025_04/Photo.webp" -> Try to find "April 2025" logic
    // This is brittle, relies heavily on path structure matching keys.
    // A better approach might be to pass the month during the call.
    // For now, returning currentMonth as a placeholder for the check logic.
    return currentMonth;
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

        await validateImages(); // Creates validImages object for image types
        logImageCounts(); // Log counts after validation

        // Determine initial month from hash or first valid IMAGE entry
        let initialMonth = '';
        const hashMonth = decodeURIComponent(window.location.hash.slice(1));

        // Check if hash corresponds to a valid IMAGE type entry
        if (hashMonth && slideshowData[hashMonth] && (slideshowData[hashMonth].type === 'image' || !slideshowData[hashMonth].type)) {
            initialMonth = hashMonth;
        } else {
            // Find the first key in slideshowData that is an image type and has valid images
             initialMonth = Object.keys(slideshowData).find(month =>
                (slideshowData[month].type === 'image' || !slideshowData[month].type) && // Check type is image (or undefined)
                validImages[month] && validImages[month].length > 0
            ) || ''; // Fallback to empty string if no suitable image month found
        }

        console.log("Initial image month determined as:", initialMonth || "None");

        if (!initialMonth) {
             // No valid image slideshow found to start with
             console.warn("No initial image slideshow found (hash invalid or no image entries). Displaying message.");
             displayErrorMessage('Select an image slideshow from the navigation.');
             if (currentMonthElement) currentMonthElement.textContent = "No Slideshow Selected";
             // Don't throw an error, just wait for user navigation
             isInitialized = true; // Mark as initialized even if no content shown initially
             return; // Stop further processing
        }

        if (!slideshowData[initialMonth]) {
             console.error(`Attempted initial month "${initialMonth}" not found in slideshowData.`);
             // This case should be less likely now with the find logic, but as a fallback:
             displayErrorMessage(`Error: Initial slideshow data for "${initialMonth}" not found.`);
              window.slideshowInitialized = false; // Reset flag on critical error
             return;
        }

        console.log("Setting initial month to:", initialMonth);
        // Use requestAnimationFrame to ensure DOM is ready for image update
        requestAnimationFrame(() => {
            setMonth(initialMonth); // Set month internally
            // lazyLoadFirstImage() is now called within setMonth for image types
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
        container.innerHTML = `<p class="error-message" style="padding: 20px; text-align: center; color: grey;">${message}</p>`;
         // Ensure controls etc are hidden or removed if error replaces content
         const controls = document.getElementById('controls');
         const counter = document.querySelector('.image-counter');
         if (controls) controls.style.display = 'none';
         if (counter) counter.style.display = 'none';
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
         const entry = slideshowData[month];

         // Only validate for entries marked as 'image' or without a type field
         if (entry.type === 'image' || !entry.type) {
            if (entry.images && Array.isArray(entry.images)) {
                const declaredCount = entry.imageCount || entry.images.length;
                const currentMonthImages = []; // Store valid images for this specific month

                // Use a Set to ensure unique images
                const uniqueImages = new Set();
                const duplicateImages = new Set();
                const missingImages = new Set(); // Only used if ENABLE_PRELOAD_VALIDATION is true

                 console.log(`Validating ${month}... Declared: ${declaredCount}, Found paths: ${entry.images.length}`);

                const imageCheckPromises = entry.images.map(async (imagePath) => {
                    if (!imagePath || typeof imagePath !== 'string') {
                        console.warn(`[${month}] Invalid image path found:`, imagePath);
                        return null; // Skip invalid entry
                    }
                    if (uniqueImages.has(imagePath)) {
                        duplicateImages.add(imagePath);
                        return null; // Skip duplicate
                    }
                    uniqueImages.add(imagePath);

                    if (ENABLE_PRELOAD_VALIDATION) {
                        try {
                            await preloadImage(imagePath);
                            return imagePath; // Return valid path
                        } catch (error) {
                            // console.error(`Failed to load image: ${imagePath}`, error); // Too noisy potentially
                            missingImages.add(imagePath);
                            return null; // Skip missing image
                        }
                    } else {
                        // If not preloading validation, assume path is valid for now
                        return imagePath;
                    }
                });

                const results = await Promise.all(imageCheckPromises);
                // Filter out null results (duplicates or missing/invalid images)
                currentMonthImages.push(...results.filter(path => path !== null));

                validImages[month] = currentMonthImages; // Assign the validated list

                // --- Logging ---
                if (duplicateImages.size > 0) {
                    console.warn(`[${month}] Duplicate image paths found (${duplicateImages.size}):`, Array.from(duplicateImages));
                }
                if (ENABLE_PRELOAD_VALIDATION && missingImages.size > 0) {
                    console.warn(`[${month}] Missing/unloadable images (${missingImages.size}):`, Array.from(missingImages));
                }
                // Compare validated count with declared count if available
                if (entry.imageCount && entry.imageCount !== validImages[month].length) {
                     console.warn(`[${month}] Mismatch in image count. Declared: ${entry.imageCount}, Actual Valid: ${validImages[month].length}`);
                } else if (!entry.imageCount && entry.images.length !== validImages[month].length) {
                    // Compare validated count with array length if imageCount wasn't provided
                    console.warn(`[${month}] Mismatch after validation. Original paths: ${entry.images.length}, Valid paths: ${validImages[month].length}`);
                }
                // --- End Logging ---

            } else {
                 console.warn(`No 'images' array found for image-type month: ${month}`);
                 validImages[month] = []; // Ensure entry exists even if empty/invalid
            }
         } else if (entry.type === 'video') {
             // Video entry, skip image validation
             console.log(`${month}: Video entry, skipping image validation.`);
             // We don't need to store video paths in validImages
         } else {
             console.warn(`Unknown entry type "${entry.type}" for month: ${month}`);
         }
    }
     console.log("Image validation complete.");
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
    // Check if the current month is an image slideshow
    const isImageSlideshow = currentMonth && (slideshowData[currentMonth]?.type === 'image' || !slideshowData[currentMonth]?.type);
    const currentMonthValidImages = isImageSlideshow ? validImages[currentMonth] : null;
    const numImages = currentMonthValidImages ? currentMonthValidImages.length : 0;

    if (currentImageElement && totalImagesElement) {
        currentImageElement.textContent = numImages > 0 ? currentIndex + 1 : 0;
        totalImagesElement.textContent = numImages;

        // Show/hide counter based on whether it's an image slideshow with images
         const counterElement = document.querySelector('.image-counter');
         if (counterElement) {
             counterElement.style.display = (isImageSlideshow && numImages > 0) ? 'block' : 'none';
         }
    }
}

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
        audioElement.src = ''; // Clear audio source
    }
    // Keep audio muted state as user set it
    if (audioControlButton) {
         audioControlButton.innerHTML = audioElement.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    }

     // Also reset image display
     if (slideshowImage) {
         slideshowImage.src = '';
         slideshowImage.alt = 'Select a slideshow';
     }
     // Reset counter
     if (currentImageElement) currentImageElement.textContent = '0';
     if (totalImagesElement) totalImagesElement.textContent = '0';
     const counterElement = document.querySelector('.image-counter');
     if (counterElement) counterElement.style.display = 'none'; // Hide counter initially

}


function moveToNextImage() {
    const currentMonthValidImages = validImages[currentMonth];
    if (currentMonthValidImages && currentMonthValidImages.length > 0) {
        currentIndex = (currentIndex + 1) % currentMonthValidImages.length;
        updateImage();
    }
}

function moveToPrevImage() {
    const currentMonthValidImages = validImages[currentMonth];
     if (currentMonthValidImages && currentMonthValidImages.length > 0) {
        currentIndex = (currentIndex - 1 + currentMonthValidImages.length) % currentMonthValidImages.length;
        updateImage();
    }
}


class ImagePreloader {
    constructor() {
        this.cache = new Map(); // Stores Image objects
    }

    preload(imagePaths) {
        if (!Array.isArray(imagePaths)) return;
        imagePaths.forEach(path => {
            if (path && typeof path === 'string' && !this.cache.has(path)) {
                const img = new Image();
                img.src = path; // Start loading
                this.cache.set(path, img); // Store the Image object immediately
            }
        });
    }

    // Optional: Method to check if an image is loaded
    isLoaded(path) {
        const img = this.cache.get(path);
        return img && img.complete && img.naturalWidth > 0;
    }

    getImage(path) {
        return this.cache.get(path);
    }

    clear() {
        // Optional: Could implement more sophisticated cache eviction later if needed
        this.cache.clear();
        console.log("Image preloader cache cleared.");
    }
}

const imagePreloader = new ImagePreloader();

function preloadImages(startIndex) {
    // Ensure current month is an image slideshow and has valid images
    const isImageSlideshow = currentMonth && (slideshowData[currentMonth]?.type === 'image' || !slideshowData[currentMonth]?.type);
    if (!isImageSlideshow || !validImages[currentMonth] || validImages[currentMonth].length === 0) {
        // console.log(`Skipping preload for ${currentMonth}: Not an image slideshow or no images.`);
        return;
    }

    const currentMonthValidImages = validImages[currentMonth];
    const imagesToLoad = [];
    const totalImages = currentMonthValidImages.length;

    // Preload next PRELOAD_COUNT images, wrapping around
    for (let i = 1; i <= PRELOAD_COUNT; i++) { // Start from 1 (next image)
        const index = (startIndex + i) % totalImages;
        const imagePath = currentMonthValidImages[index];
        // Check if path is valid and not already cached OR if cached but failed to load previously
        if (imagePath && typeof imagePath === 'string') {
            const cachedImg = imagePreloader.getImage(imagePath);
            if (!cachedImg || (cachedImg && !cachedImg.complete && cachedImg.naturalWidth === 0)) { // Check completion and naturalWidth for loaded state
                imagesToLoad.push(imagePath);
            }
        }
    }

    if (imagesToLoad.length > 0) {
        // console.log(`Preloading images starting from index ${startIndex + 1} for ${currentMonth}:`, imagesToLoad);
        imagePreloader.preload(imagesToLoad);
    }
}

function updateImage() {
    const isImageSlideshow = currentMonth && (slideshowData[currentMonth]?.type === 'image' || !slideshowData[currentMonth]?.type);

    if (!slideshowImage) return;

    if (!isImageSlideshow) {
        // console.log(`Current entry "${currentMonth}" is not an image slideshow. Clearing image display.`);
        slideshowImage.src = '';
        slideshowImage.alt = 'This entry is not an image slideshow.';
        updateImageCounter();
        requestAnimationFrame(adjustImageSize); // Adjust for empty/placeholder state
        return;
    }

    const currentMonthValidImages = validImages[currentMonth];

    if (currentMonthValidImages && currentMonthValidImages.length > 0) {
        if (currentIndex < 0 || currentIndex >= currentMonthValidImages.length) {
            console.warn(`Invalid currentIndex (${currentIndex}) for ${currentMonth}. Resetting to 0.`);
            currentIndex = 0;
        }

        const imagePath = currentMonthValidImages[currentIndex];
        if (!imagePath || typeof imagePath !== 'string') {
            console.error(`Invalid image path at index ${currentIndex} for ${currentMonth}. Skipping update.`);
            slideshowImage.alt = `Error: Invalid image data at index ${currentIndex + 1}`;
            slideshowImage.src = ''; // Clear src on error
            requestAnimationFrame(adjustImageSize);
            // Optionally call handleImageLoadError here if you want auto-advance on invalid path
            return;
        }

        console.log(`Updating image to index ${currentIndex}: ${imagePath}`);
        slideshowImage.alt = `Loading ${currentMonth} image ${currentIndex + 1}...`;
        // Set placeholder or clear src *before* attaching onload/onerror
        slideshowImage.src = ''; // Or 'assets/images/loading.gif';

        // Define load/error handlers *before* setting the final src
        slideshowImage.onload = () => {
            console.log(`Image ${imagePath} loaded successfully into element.`);
            slideshowImage.alt = `${currentMonth} image ${currentIndex + 1}`; // Set final alt text
            requestAnimationFrame(adjustImageSize); // Adjust size after successful load
            updateImageCounter();
            preloadImages(currentIndex);
            slideshowImage.onload = null; // Clean up handler
            slideshowImage.onerror = null; // Clean up handler
        };

        slideshowImage.onerror = () => {
            console.error(`Failed to load image into slideshow element: ${imagePath}`);
            slideshowImage.alt = `Error loading image ${currentIndex + 1}`;
             // Don't automatically clear src here, leave the alt text visible
             requestAnimationFrame(adjustImageSize); // Adjust size based on failed state (might be small)
             slideshowImage.onload = null; // Clean up handler
             slideshowImage.onerror = null; // Clean up handler
            // Handle advancing to next image
            if (currentMonthValidImages[currentIndex] === imagePath) {
                 handleImageLoadError(imagePath);
            }
        };

        // Now, set the actual image source. The handlers above will catch the result.
        slideshowImage.src = imagePath;

    } else {
        console.warn(`No valid images to display for ${currentMonth}.`);
        slideshowImage.src = '';
        slideshowImage.alt = `No images available for ${currentMonth}`;
        updateImageCounter();
        requestAnimationFrame(adjustImageSize);
    }
}

// Ensure you also have the handleImageLoadError helper function from the previous step:
function handleImageLoadError(failedPath) {
     console.warn(`Attempting to move to next image due to load error for ${failedPath}.`);
     const currentMonthValidImages = validImages[currentMonth];
     const totalImages = currentMonthValidImages?.length || 0;

     if (totalImages === 0) {
         displayErrorMessage(`No valid images found for ${currentMonth}.`);
         return;
     }

     if (totalImages === 1) {
         // Only one image and it failed
         displayErrorMessage(`Failed to load the only image for ${currentMonth}.`);
         slideshowImage.alt = `Error loading image`; // Update alt text
         slideshowImage.src = ''; // Clear src
         requestAnimationFrame(adjustImageSize);
     } else {
         // More than one image, try moving to the next
         // Avoid immediate recursion if next also fails instantly
         setTimeout(moveToNextImage, 100);
     }
}

// You may also want the refined adjustImageSize function from the previous step:
function adjustImageSize() {
    const img = document.querySelector('#slideshow img');
    const container = document.getElementById('slideshow-container');

    if (!img || !container) return;

    // Reset styles before calculating
    img.style.width = '';
    img.style.height = '';

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Ensure container has dimensions AND image has loaded dimensions or src is empty
    if (containerWidth > 0 && containerHeight > 0) {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) { // Image loaded
            const containerAspect = containerWidth / containerHeight;
            const imageAspect = img.naturalWidth / img.naturalHeight;

            if (imageAspect > containerAspect) {
                img.style.width = '100%';
                img.style.height = 'auto';
            } else {
                img.style.width = 'auto';
                img.style.height = '100%';
            }
        } else { // Image not loaded (src empty, error, or loading) - use auto sizing
             img.style.width = 'auto';
             img.style.height = 'auto';
             // console.log(`Image not loaded or failed, using auto size.`);
        }
    } else if (containerWidth === 0 || containerHeight === 0) {
         console.warn("Container dimensions are zero, cannot adjust image size properly yet.");
    }
}


function setMonth(month) {
    if (!slideshowData[month]) {
         console.error(`Attempted to set invalid month: ${month}`);
         displayErrorMessage(`Selected slideshow "${month}" not found.`);
         // Don't change hash back automatically, let user select a valid one.
         return; // Stop processing
    }

     // --- IMPORTANT: Check if selected month is a VIDEO type ---
     // Although navbar.js routes video types away, a manual hash change could land here.
     // Redirect to the appropriate video player page if detected.
     if (slideshowData[month].type === 'video') {
         console.log(`Hash change detected for video entry: ${month}. Redirecting...`);
         const entry = slideshowData[month];
         if (month === "Rachel's Video") { // Keep special case
             window.location.href = 'rachel.html';
         } else if (entry.videoSrc) {
             const videoSrcEncoded = encodeURIComponent(entry.videoSrc);
             const titleEncoded = encodeURIComponent(month);
             window.location.href = `video-player.html?video=${videoSrcEncoded}&title=${titleEncoded}`;
         } else {
              console.error(`Video entry "${month}" is missing videoSrc. Cannot redirect.`);
              displayErrorMessage(`Configuration error for video "${month}".`);
         }
         return; // Stop further processing in this script
     }

    // --- Proceed only if it's an IMAGE type slideshow ---
    console.log(`Setting month to (image slideshow): ${month}`);
    resetSlideshow(); // Stop existing slideshow/audio first
    currentMonth = month;
    currentIndex = 0; // Always reset index when changing month
    currentAudioIndex = 0; // Reset audio index too

    if (currentMonthElement) currentMonthElement.textContent = month;

    // Only update hash if it's not already correct (prevent hashchange loop)
    const currentHash = decodeURIComponent(window.location.hash.slice(1));
    if (currentHash !== month) {
        window.location.hash = encodeURIComponent(month); // Update hash
    }


    // Handle Image Slideshow Type
    if (validImages[month]) { // Check if validImages entry exists
        console.log(`Month ${month} has ${validImages[month].length} valid images.`);
        imagePreloader.clear(); // Clear cache for previous month's images
        updateImage(); // Display the first image (or placeholder if none)
        updateAudio(); // Load the first audio track
        updateImageCounter(); // Update counter display (will show/hide based on image count)
    } else {
         // This case means slideshowData exists, type is image, but validImages didn't populate.
         console.error(`Logic error: validImages entry missing or empty for image month ${month}.`);
         displayErrorMessage(`Error processing images for ${month}. Check image paths.`);
         updateImageCounter(); // Ensure counter shows 0/0 and is hidden
    }
}


function updateAudio() {
    // Ensure it's an image slideshow with audio defined
    const entry = slideshowData[currentMonth];
    const isImageSlideshow = currentMonth && (entry?.type === 'image' || !entry?.type);

    if (!isImageSlideshow || !entry.audio || !Array.isArray(entry.audio) || entry.audio.length === 0) {
        // console.log(`No audio defined or not an image slideshow: ${currentMonth}.`);
        if (audioElement) audioElement.src = ''; // Clear src if no audio
        return;
    }

    const audioTracks = entry.audio;

     // Ensure audio index is valid
    if (currentAudioIndex < 0 || currentAudioIndex >= audioTracks.length) {
        currentAudioIndex = 0;
    }

    const audioSrc = audioTracks[currentAudioIndex];
    if (!audioSrc || typeof audioSrc !== 'string') {
         console.error(`Invalid audio source at index ${currentAudioIndex} for ${currentMonth}`);
         // Optionally try next track or stop audio
         return;
    }

    console.log(`Updating audio to track ${currentAudioIndex}: ${audioSrc}`);

    if (audioElement) {
         // Only change src if it's different to avoid unnecessary reloads/pauses
        try {
            const currentSrcUrl = audioElement.currentSrc ? new URL(audioElement.currentSrc) : null;
            const newSrcUrl = new URL(audioSrc, window.location.origin); // Resolve relative paths

            if (!currentSrcUrl || currentSrcUrl.pathname !== newSrcUrl.pathname) {
                 console.log("Audio source changed. Loading new track.");
                 audioElement.src = audioSrc;
                 audioElement.load(); // Explicitly load the new source
             } else {
                 console.log("Audio source is the same. Not reloading.");
                 // If source is same but paused, and slideshow is playing, maybe resume?
                 if (isSlideshowPlaying && audioElement.paused && !audioElement.muted) {
                      audioElement.play().catch(e => console.warn("Failed to resume same audio track:", e.name));
                 }
             }
        } catch (e) {
             console.error("Error comparing or setting audio URLs:", e);
             // Fallback to setting src directly
             audioElement.src = audioSrc;
             audioElement.load();
        }


        // Update control button based on muted state
        if (audioControlButton) {
            audioControlButton.innerHTML = audioElement.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        }

         // If the slideshow is supposed to be playing, attempt to play audio
         // Only play if source is valid and not muted
        if (isSlideshowPlaying && audioElement.src && !audioElement.muted) {
            // Use a promise to handle potential autoplay restrictions
            const playPromise = audioElement.play();
            if (playPromise !== undefined) {
                 playPromise.then(_ => {
                     // Autoplay started!
                     console.log("Audio playback started.");
                 }).catch(error => {
                     // Autoplay was prevented.
                     if (error.name === 'NotAllowedError') {
                          console.warn("Audio autoplay prevented by browser. User interaction required.");
                          // Optionally pause the visual slideshow until user interacts (e.g., unmutes)
                          // toggleSlideshow(); // This would pause visually if desired
                     } else {
                          console.error("Audio play failed:", error);
                     }
                 });
            }
        }
    }
}


function moveToNextAudio() {
    const entry = slideshowData[currentMonth];
    const isImageSlideshow = currentMonth && (entry?.type === 'image' || !entry?.type);

    if (!isImageSlideshow || !entry.audio || !Array.isArray(entry.audio) || entry.audio.length <= 1) { // Check length > 1
        // console.log("Not moving to next audio: Not image slideshow or <= 1 track.");
        // If only one track, maybe restart it?
        if (entry?.audio?.length === 1 && audioElement && isSlideshowPlaying && !audioElement.muted) {
             console.log("Restarting single audio track.");
             audioElement.currentTime = 0;
             audioElement.play().catch(e => console.warn("Failed to restart single track:", e.name));
        }
        return;
    }
    currentAudioIndex = (currentAudioIndex + 1) % entry.audio.length;
    console.log(`Moving to next audio index: ${currentAudioIndex}`);
    updateAudio(); // updateAudio handles loading and playing if necessary
}

function toggleSlideshow() {
    const isImageSlideshow = currentMonth && (slideshowData[currentMonth]?.type === 'image' || !slideshowData[currentMonth]?.type);
    // Only allow play/pause for image slideshows with valid images
    if (!isImageSlideshow || !validImages[currentMonth] || validImages[currentMonth].length === 0) {
         console.warn(`Cannot toggle slideshow for "${currentMonth}". Not a valid image slideshow.`);
         // Ensure button is in 'play' state
         if (pauseSlideshowButton) pauseSlideshowButton.innerHTML = '<i class="fas fa-play"></i>';
         isSlideshowPlaying = false;
         if (slideshowInterval) clearInterval(slideshowInterval);
         if (audioElement && !audioElement.paused) audioElement.pause();
         return;
    }

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
        const currentMonthData = slideshowData[currentMonth]; // We know this exists and is image type now
        const interval = (currentMonthData.interval && currentMonthData.interval > 500) ? currentMonthData.interval : 6000; // Default interval, minimum 500ms
        // Prevent multiple intervals if clicked rapidly
        if (slideshowInterval) clearInterval(slideshowInterval);
        // Move to next image immediately on play *if not already on first image*? Optional.
        // if (currentIndex !== 0) moveToNextImage();
        slideshowInterval = setInterval(moveToNextImage, interval);
        if (pauseSlideshowButton) pauseSlideshowButton.innerHTML = '<i class="fas fa-pause"></i>';

        // Attempt to play audio only if not muted and source exists
        if (audioElement && !audioElement.muted && audioElement.src) {
             const playPromise = audioElement.play();
             if (playPromise !== undefined) {
                 playPromise.catch(error => {
                     if (error.name === 'NotAllowedError') {
                          console.warn("Audio autoplay prevented on play button click. User interaction might be needed again (e.g., unmute).");
                     } else {
                          console.error("Audio play failed on toggle:", error);
                     }
                 });
             }
        }
        isSlideshowPlaying = true;
        console.log(`Slideshow Playing (${interval}ms interval)`);
        // Preload initial set of images when play starts
        preloadImages(currentIndex);
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
            const interval = (slideshowData[currentMonth]?.interval && slideshowData[currentMonth].interval > 500) ? slideshowData[currentMonth].interval : 6000;
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
            const interval = (slideshowData[currentMonth]?.interval && slideshowData[currentMonth].interval > 500) ? slideshowData[currentMonth].interval : 6000;
            slideshowInterval = setInterval(moveToNextImage, interval);
        }
    });
}

if (audioControlButton) {
    audioControlButton.addEventListener('click', () => {
        if (audioElement) {
            const wasMuted = audioElement.muted;
            audioElement.muted = !audioElement.muted;
            audioControlButton.innerHTML = audioElement.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
            console.log("Audio muted:", audioElement.muted);

            // If unmuting and slideshow is playing, try to play audio
            if (!audioElement.muted && wasMuted && isSlideshowPlaying && audioElement.src && audioElement.paused) {
                 audioElement.play().catch(e => console.warn("Audio play failed after unmute:", e.name));
            }
            // If muting, ensure audio stops
            if (audioElement.muted && !audioElement.paused) {
                 audioElement.pause();
            }
        }
    });
}

if (audioElement) {
    // When audio ends, move to the next track if available
    audioElement.addEventListener('ended', () => {
        console.log("Audio track ended.");
        moveToNextAudio(); // Will handle restarting single track or moving to next
    });

    // Update mute button if muted state changes programmatically elsewhere
     audioElement.addEventListener('volumechange', () => {
         if (audioControlButton) {
            // Also reflect mute state if volume becomes 0
            audioControlButton.innerHTML = (audioElement.muted || audioElement.volume === 0) ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
         }
     });
}

// Listen for hash changes to navigate between slideshows
window.addEventListener('hashchange', () => {
    console.log("Hash changed:", window.location.hash);
    const monthFromHash = decodeURIComponent(window.location.hash.slice(1));

    if (monthFromHash) {
        // Check if the target month actually exists in the data
        if (slideshowData[monthFromHash]) {
             // setMonth will handle checking type and redirecting if it's video,
             // or loading if it's image type.
             if (monthFromHash !== currentMonth || !isInitialized) { // Avoid reloading same month unless not init
                setMonth(monthFromHash);
             }
        } else {
             console.warn(`Hash changed to non-existent month: ${monthFromHash}. Ignoring.`);
             // Display error or guide user
             displayErrorMessage(`Slideshow "${monthFromHash}" not found. Please select from the navigation.`);
             if (currentMonthElement) currentMonthElement.textContent = "Invalid Slideshow";
             resetSlideshow(); // Clear any existing state
        }
    } else if (isInitialized) { // Hash cleared after initialization
        // Hash cleared, maybe go back to the first default image month? Or just clear display?
        console.log("Hash cleared. Resetting display.");
        if (currentMonthElement) currentMonthElement.textContent = "Select Slideshow";
        resetSlideshow(); // Stop slideshow, clear audio/image
        currentMonth = ''; // Reset current month tracking
         // Optionally, navigate to the first available image slideshow?
         // const firstImageMonth = Object.keys(slideshowData).find(month => (slideshowData[month].type === 'image' || !slideshowData[month].type) && validImages[month]?.length > 0);
         // if (firstImageMonth) window.location.hash = encodeURIComponent(firstImageMonth);
    }
});

// Adjust image size on window resize
window.addEventListener('resize', adjustImageSize);

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded. Initializing slideshow...");
    // Only load data if on index.html
    if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) {
        loadSlideshowData(); // Start loading data and setting up
    } else {
         console.log("Not on index.html, skipping slideshow data load.");
         // Navbar loading is handled separately by navbar.js if present on other pages
    }
});

// Safety net: Call loadSlideshowData again in case DOMContentLoaded already fired
// Use the flag to prevent multiple runs
if (document.readyState === 'complete' || document.readyState === 'interactive') {
     if (!window.slideshowInitialized && (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html'))) {
         console.log("DOM already ready, attempting initialization.");
         loadSlideshowData();
     }
}