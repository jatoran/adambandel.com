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
const PRELOAD_COUNT = 5; // Number of images to preload ahead

// Set to true if you want to check if all images in JSON exist
const ENABLE_PRELOAD = false;

function logImageCounts() {
    for (const month in validImages) {
        console.log(`${month}: ${validImages[month].length} images`);
    }
}

function lazyLoadFirstImage() {
    if (validImages[currentMonth] && validImages[currentMonth].length > 0) {
        const firstImagePath = validImages[currentMonth][0];
        const img = new Image();
        img.onload = () => {
            slideshowImage.src = firstImagePath;
            updateImageCounter();
            adjustImageSize();
            preloadImages(1);
        };
        img.src = firstImagePath;
    }
}

// Update the loadSlideshowData function
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
        lazyLoadFirstImage();

        isInitialized = true;
        console.log('Slideshow data loaded successfully');
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



function resetSlideshow() {
    if (slideshowInterval) clearInterval(slideshowInterval);
    isSlideshowPlaying = false;
    if (pauseSlideshowButton) pauseSlideshowButton.innerHTML = '<i class="fas fa-play"></i>';
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
    if (audioControlButton) audioControlButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
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


class ImagePreloader {
    constructor() {
        this.cache = new Map();
        this.preloadQueue = [];
    }

    preload(imagePaths) {
        imagePaths.forEach(path => {
            if (!this.cache.has(path)) {
                const img = new Image();
                img.src = path;
                this.cache.set(path, img);
            }
        });
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
    const imagesToLoad = [];
    const totalImages = validImages[currentMonth].length;

    for (let i = 0; i < PRELOAD_COUNT; i++) {
        const index = (startIndex + i) % totalImages;
        const imagePath = validImages[currentMonth][index];
        if (!imagePreloader.getImage(imagePath)) {
            imagesToLoad.push(imagePath);
        }
    }

    imagePreloader.preload(imagesToLoad);
}

let observer;

function setupIntersectionObserver() {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.dataset.index, 10);
                preloadImages(index);
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px 200px 0px' // Start loading when image is 200px from viewport
    });
}

function updateImage() {
    if (slideshowImage && validImages[currentMonth] && validImages[currentMonth].length > 0) {
        const imagePath = validImages[currentMonth][currentIndex];
        const preloadedImage = imagePreloader.getImage(imagePath);

        if (preloadedImage && preloadedImage.complete) {
            slideshowImage.src = imagePath;
            updateImageCounter();
            adjustImageSize();
        } else {
            const img = new Image();
            img.onload = () => {
                slideshowImage.src = imagePath;
                updateImageCounter();
                adjustImageSize();
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${imagePath}`);
                moveToNextImage();
            };
            img.src = imagePath;
        }

        // Set up the next image for intersection observing
        const nextIndex = (currentIndex + 1) % validImages[currentMonth].length;
        slideshowImage.dataset.index = nextIndex.toString();
        observer.observe(slideshowImage);
    }
}

function setMonth(month) {
    if (month !== currentMonth && validImages[month] && validImages[month].length > 0) {
        resetSlideshow();
        currentMonth = month;
        if (currentMonthElement) currentMonthElement.textContent = month;

        if (slideshowData[month] && slideshowData[month].type === "video") {
            window.location.href = "rachel.html";
        } else {
            currentIndex = 0;
            currentAudioIndex = 0;
            imagePreloader.clear(); // Clear the cache when changing months
            preloadImages(0); // Start preloading images for the new month
            updateImage();
            updateAudio();
            updateImageCounter();
            window.location.hash = encodeURIComponent(month);
        }
    }
}

function updateAudio() {
    if (audioElement && slideshowData[currentMonth] && slideshowData[currentMonth].audio) {
        audioElement.src = slideshowData[currentMonth].audio[currentAudioIndex];
    }
}


function moveToNextAudio() {
    currentAudioIndex = (currentAudioIndex + 1) % slideshowData[currentMonth].audio.length;
    updateAudio();
    audioElement.play().catch(error => console.error("Audio play failed:", error));
}

function toggleSlideshow() {
    if (isSlideshowPlaying) {
        clearInterval(slideshowInterval);
        pauseSlideshowButton.innerHTML = '<i class="fas fa-play"></i>';
        audioElement.pause();
        audioControlButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        const interval = slideshowData[currentMonth].interval || 6000;
        slideshowInterval = setInterval(moveToNextImage, interval);
        pauseSlideshowButton.innerHTML = '<i class="fas fa-pause"></i>';
        audioElement.play().catch(error => console.error("Audio play failed:", error));
        audioControlButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    isSlideshowPlaying = !isSlideshowPlaying;
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
        audioElement.muted = !audioElement.muted;
        audioControlButton.innerHTML = audioElement.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
    });
}

if (audioElement) {
    audioElement.addEventListener('ended', () => {
        moveToNextAudio();
    });
}

window.addEventListener('hashchange', () => {
    const month = decodeURIComponent(window.location.hash.slice(1));
    if (slideshowData[month]) {
        setMonth(month);
    }
});

// Initialize the slideshow or video page
document.addEventListener('DOMContentLoaded', () => {
    loadSlideshowData();
    setupIntersectionObserver();
    if (window.location.pathname.includes('rachel.html')) {
        currentMonth = "Rachel's Video";
        if (currentMonthElement) {
            currentMonthElement.textContent = "Rachel's Video";
        }
    }
});

// Also call loadSlideshowData immediately in case DOMContentLoaded has already fired
loadSlideshowData();

logImageCounts();


window.addEventListener('resize', adjustImageSize);