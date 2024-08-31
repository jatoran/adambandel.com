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
const monthList = document.getElementById('month-list');
const monthNav = document.querySelector('.month-nav');
const navLeft = document.querySelector('.nav-left');
const navRight = document.querySelector('.nav-right');
const currentImageElement = document.getElementById('current-image');
const totalImagesElement = document.getElementById('total-images');



function logImageCounts() {
    for (const month in validImages) {
        console.log(`${month}: ${validImages[month].length} images`);
    }
}
// Set to true if you want to check if all images in JSON exist
const ENABLE_PRELOAD = false;

async function loadSlideshowData() {
    if (isInitialized) return;

    try {
        const response = await fetch('slideshow_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        slideshowData = await response.json();
        
        await validateImages();
        setupMonthList();
        
        const initialMonth = decodeURIComponent(window.location.hash.slice(1)) || Object.keys(slideshowData)[0];
        
        if (!slideshowData[initialMonth]) {
            throw new Error(`Invalid month: ${initialMonth}`);
        }
        
        setMonth(initialMonth);
        
        isInitialized = true;
        // console.log('Slideshow data loaded successfully');
    } catch (error) {
        console.error('Error loading slideshow data:', error);
        displayErrorMessage('Error loading slideshow. Please try refreshing the page.');
    }
}

function displayErrorMessage(message) {
    const container = document.getElementById('slideshow-container');
    if (container) {
        container.innerHTML = `<p class="error-message">${message}</p>`;
    } else {
        document.body.innerHTML += `<p class="error-message">${message}</p>`;
    }
}

async function validateImages() {
    for (const month in slideshowData) {
        if (slideshowData[month].images) {
            const declaredCount = slideshowData[month].imageCount || slideshowData[month].images.length;
            validImages[month] = [];

            // Use a Set to ensure unique images
            const uniqueImages = new Set();
            const duplicateImages = new Set();
            const missingImages = new Set();

            for (const imagePath of slideshowData[month].images) {
                if (uniqueImages.has(imagePath)) {
                    duplicateImages.add(imagePath);
                } else {
                    uniqueImages.add(imagePath);
                }

                if (ENABLE_PRELOAD) {
                    try {
                        await preloadImage(imagePath);
                        validImages[month].push(imagePath);
                    } catch (error) {
                        console.error(`Failed to load image: ${imagePath}`, error);
                        missingImages.add(imagePath);
                    }
                } else {
                    validImages[month].push(imagePath);
                }
            }

            console.log(`${month}:`);
            console.log(`  Declared count: ${declaredCount}`);
            console.log(`  Total image paths: ${slideshowData[month].images.length}`);
            console.log(`  Unique image paths: ${uniqueImages.size}`);
            console.log(`  Valid images: ${validImages[month].length}`);

            if (duplicateImages.size > 0) {
                console.warn(`  Duplicate images found (${duplicateImages.size}):`);
                duplicateImages.forEach(img => console.warn(`    ${img}`));
            }

            if (missingImages.size > 0) {
                console.warn(`  Missing images (${missingImages.size}):`);
                missingImages.forEach(img => console.warn(`    ${img}`));
            }

            if (declaredCount !== validImages[month].length) {
                console.warn(`Mismatch in image count for ${month}.`);
                console.warn(`  Declared: ${declaredCount}, Actual: ${validImages[month].length}`);
                console.warn(`  Difference: ${Math.abs(declaredCount - validImages[month].length)}`);
            }

            // Use the declared count, but ensure it doesn't exceed the number of valid images
            validImages[month].declaredCount = Math.min(declaredCount, validImages[month].length);
        }
    }
}

function adjustImageSize() {
    const img = document.querySelector('#slideshow img');
    const container = document.getElementById('slideshow-container');
  
    if (img && container) {
      const containerAspect = container.clientWidth / container.clientHeight;
      const imageAspect = img.naturalWidth / img.naturalHeight;
  
      if (imageAspect > containerAspect) {
        // Horizontal image
        img.style.width = '100%';
        img.style.height = 'auto';
      } else {
        // Vertical image
        img.style.width = 'auto';
        img.style.height = '100%';
      }
    }
  }

function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => reject(`Failed to load ${src}`);
        img.src = src;
    });
}

function updateImageCounter() {
    if (currentImageElement && totalImagesElement && validImages[currentMonth]) {
        currentImageElement.textContent = currentIndex + 1;
        totalImagesElement.textContent = validImages[currentMonth].length;
    }

    const img = document.querySelector('#slideshow img');
    img.onload = adjustImageSize;
}
function setupMonthList() {
    monthList.innerHTML = '';
    Object.keys(slideshowData).forEach(month => {
        if (!ENABLE_PRELOAD || (validImages[month] && validImages[month].length > 0)) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = month === "Rachel's Video" ? "rachel.html" : `index.html#${encodeURIComponent(month)}`;
            a.textContent = month;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                if (month === "Rachel's Video") {
                    window.location.href = "rachel.html";
                } else {
                    window.location.href = `index.html#${encodeURIComponent(month)}`;
                }
            });
            li.appendChild(a);
            monthList.appendChild(li);
        } else if (ENABLE_PRELOAD) {
            console.warn(`Skipping ${month} in navigation due to no valid images`);
        }
    });
    updateNavArrows();
}

function updateNavArrows() {
    if (monthList.scrollWidth > monthList.clientWidth) {
        navLeft.style.display = 'block';
        navRight.style.display = 'block';
    } else {
        navLeft.style.display = 'none';
        navRight.style.display = 'none';
    }
}

function scrollNav(direction) {
    const scrollAmount = monthList.clientWidth * 0.8;
    monthList.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
    });
}

if (navLeft) {
    navLeft.addEventListener('click', () => scrollNav('left'));
}

if (navRight) {
    navRight.addEventListener('click', () => scrollNav('right'));
}

window.addEventListener('resize', updateNavArrows);



const PRELOAD_COUNT = 3; // Number of images to preload ahead

function preloadImages(startIndex) {
    const imagesToLoad = [];
    for (let i = 1; i <= PRELOAD_COUNT; i++) {
        const index = (startIndex + i) % validImages[currentMonth].length;
        imagesToLoad.push(validImages[currentMonth][index]);
    }

    imagesToLoad.forEach(imagePath => {
        const img = new Image();
        img.src = imagePath;
    });
}

function updateImage() {
    if (slideshowImage && validImages[currentMonth] && validImages[currentMonth].length > 0) {
        const imagePath = validImages[currentMonth][currentIndex];
        const img = new Image();
        img.onload = () => {
            slideshowImage.src = imagePath;
            updateImageCounter();
            adjustImageSize();
            
            // Preload the next few images
            preloadImages(currentIndex);
        };
        img.onerror = () => {
            console.error(`Failed to load image: ${imagePath}`);
            moveToNextImage(); // Skip to the next image if this one fails to load
        };
        img.src = imagePath;
    }
}

function moveToNextImage() {
    if (validImages[currentMonth] && validImages[currentMonth].length > 0) {
        currentIndex = (currentIndex + 1) % validImages[currentMonth].length;
        updateImage();
    }
}

function moveToPrevImage() {
    if (validImages[currentMonth] && validImages[currentMonth].length > 0) {
        currentIndex = (currentIndex - 1 + validImages[currentMonth].length) % validImages[currentMonth].length;
        updateImage();
    }
}
let audioContext;
let gainNode;
let currentSource;
let currentBuffer;
let fadeDuration = 5; // 5 seconds for fade in/out

function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
}

async function loadAudio(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

function playAudioWithFade(audioBuffer, fadeIn = true) {
    if (currentSource) {
        fadeOut().then(() => {
            currentSource.stop();
            startNewAudio(audioBuffer, fadeIn);
        });
    } else {
        startNewAudio(audioBuffer, fadeIn);
    }
}

function startNewAudio(audioBuffer, fadeIn) {
    currentSource = audioContext.createBufferSource();
    currentSource.buffer = audioBuffer;
    currentSource.loop = true;
    currentSource.connect(gainNode);

    if (fadeIn) {
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + fadeDuration);
    } else {
        gainNode.gain.setValueAtTime(1, audioContext.currentTime);
    }

    currentSource.start();
    // console.log("Audio started"); // Debug log
}

function fadeOut() {
    return new Promise((resolve) => {
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);
        setTimeout(resolve, fadeDuration * 1000);
    });
}

async function updateAudio() {
    if (!audioContext) {
        initAudio();
    }

    if (slideshowData[currentMonth] && slideshowData[currentMonth].audio) {
        const audioUrl = slideshowData[currentMonth].audio[currentAudioIndex];
        currentBuffer = await loadAudio(audioUrl);
        // console.log("Audio loaded:", audioUrl); // Debug log

        if (isSlideshowPlaying) {
            playAudioWithFade(currentBuffer, true);
        }
    }
}

async function moveToNextAudio() {
    currentAudioIndex = (currentAudioIndex + 1) % slideshowData[currentMonth].audio.length;
    if (isSlideshowPlaying) {
        await updateAudio();
    }
}

function toggleSlideshow() {
    if (isSlideshowPlaying) {
        clearInterval(slideshowInterval);
        pauseSlideshowButton.innerHTML = '<i class="fas fa-play"></i>';
        if (currentSource) {
            fadeOut().then(() => {
                currentSource.stop();
                currentSource = null;
            });
        }
    } else {
        const interval = slideshowData[currentMonth].interval || 6000;
        slideshowInterval = setInterval(moveToNextImage, interval);
        pauseSlideshowButton.innerHTML = '<i class="fas fa-pause"></i>';
        
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        if (currentBuffer) {
            playAudioWithFade(currentBuffer, true);
        } else {
            updateAudio();
        }
    }
    isSlideshowPlaying = !isSlideshowPlaying;
    console.log("Slideshow playing:", isSlideshowPlaying); // Debug log
}

async function setMonth(month) {
    if (month !== currentMonth && validImages[month] && validImages[month].length > 0) {
        resetSlideshow();
        currentMonth = month;
        if (currentMonthElement) currentMonthElement.textContent = month;

        if (slideshowData[month] && slideshowData[month].type === "video") {
            window.location.href = "rachel.html";
        } else {
            currentIndex = 0;
            currentAudioIndex = 0;
            updateImage();
            await updateAudio();
            updateImageCounter();
            window.location.hash = encodeURIComponent(month);
        }
    }
}

function resetSlideshow() {
    if (slideshowInterval) clearInterval(slideshowInterval);
    isSlideshowPlaying = false;
    if (pauseSlideshowButton) pauseSlideshowButton.innerHTML = '<i class="fas fa-play"></i>';
    if (currentSource) {
        fadeOut().then(() => {
            currentSource.stop();
            currentSource = null;
        });
    }
}

if (pauseSlideshowButton) {
    pauseSlideshowButton.addEventListener('click', toggleSlideshow);
}

if (nextButton) {
    nextButton.addEventListener('click', () => {
        moveToNextImage();
        if (isSlideshowPlaying) {
            clearInterval(slideshowInterval);
            const interval = slideshowData[currentMonth].interval || 6000;
            slideshowInterval = setInterval(moveToNextImage, interval);
        }
    });
}

if (prevButton) {
    prevButton.addEventListener('click', () => {
        moveToPrevImage();
        if (isSlideshowPlaying) {
            clearInterval(slideshowInterval);
            const interval = slideshowData[currentMonth].interval || 6000;
            slideshowInterval = setInterval(moveToNextImage, interval);
        }
    });
}

if (audioControlButton) {
    audioControlButton.addEventListener('click', () => {
        if (gainNode) {
            if (gainNode.gain.value > 0) {
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                audioControlButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                gainNode.gain.setValueAtTime(1, audioContext.currentTime);
                audioControlButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
        }
    });
}

// if (audioElement) {
//     audioElement.addEventListener('ended', () => {
//         moveToNextAudio();
//     });
// }

window.addEventListener('hashchange', () => {
    const month = decodeURIComponent(window.location.hash.slice(1));
    if (slideshowData[month]) {
        setMonth(month);
    }
});

document.addEventListener('click', function initializeAudio() {
    if (!audioContext) {
        initAudio();
    }
    document.removeEventListener('click', initializeAudio);
}, { once: true });

// Initialize the slideshow or video page
document.addEventListener('DOMContentLoaded', () => {
    loadSlideshowData();
    initAudio();

    // special handling for rachel page
    if (window.location.pathname.includes('rachel.html')) {
        currentMonth = "Rachel's Video";
        if (currentMonthElement) {
            currentMonthElement.textContent = "Rachel's Video";
        }
    }
});

loadSlideshowData();

logImageCounts();


window.addEventListener('resize', adjustImageSize);