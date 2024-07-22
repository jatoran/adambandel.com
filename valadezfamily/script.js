let currentMonth = '';
let currentIndex = 0;
let currentAudioIndex = 0;
let slideshowInterval = null;
let isSlideshowPlaying = false;
let slideshowData = {};
let isInitialized = false;
let validImages = [];

const slideshowImage = document.getElementById('slideshow-image');
const pauseSlideshowButton = document.getElementById('play-pause-slideshow');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const audioElement = document.getElementById('background-audio');
const audioControlButton = document.getElementById('audio-control');
const currentMonthElement = document.getElementById('current-month');
const monthList = document.getElementById('month-list');

// TRUE IF YOU WANT IT TO CHECK ALL IMAGES IN JSON EXIST
const ENABLE_PRELOAD = false;


async function loadSlideshowData() {
    if (isInitialized) return;
    isInitialized = true;

    const response = await fetch('slideshow_data.json');
    slideshowData = await response.json();
    
    if (ENABLE_PRELOAD) {
        await validateImages();
    } else {
        // If preloading is disabled, assume all images are valid
        for (const month in slideshowData) {
            if (slideshowData[month].images) {
                validImages[month] = slideshowData[month].images;
            }
        }
    }
    
    setupMonthList();
    
    const initialMonth = decodeURIComponent(window.location.hash.slice(1)) || Object.keys(slideshowData)[0];
    setMonth(initialMonth);
}

async function validateImages() {
    for (const month in slideshowData) {
        if (slideshowData[month].images) {
            validImages[month] = [];
            for (const imagePath of slideshowData[month].images) {
                try {
                    await preloadImage(imagePath);
                    validImages[month].push(imagePath);
                } catch (error) {
                    console.error(`Failed to load image: ${imagePath}`, error);
                }
            }
            if (validImages[month].length === 0) {
                console.error(`No valid images found for ${month}`);
            }
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

function setupMonthList() {
    monthList.innerHTML = '';
    Object.keys(slideshowData).forEach(month => {
        if (!ENABLE_PRELOAD || (validImages[month] && validImages[month].length > 0)) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = month === "Rachel's Video" ? "rachel.html" : `index.html#${encodeURIComponent(month)}`;
            a.textContent = month;
            a.addEventListener('click', (e) => {
                if (month === "Rachel's Video") {
                    return;
                }
                e.preventDefault();
                setMonth(month);
            });
            li.appendChild(a);
            monthList.appendChild(li);
        } else if (ENABLE_PRELOAD) {
            console.warn(`Skipping ${month} in navigation due to no valid images`);
        }
    });
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
            updateImage();
            updateAudio();
            window.location.hash = encodeURIComponent(month);
        }
    }
}

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



function updateImage() {
    if (slideshowImage && validImages[currentMonth] && validImages[currentMonth].length > 0) {
        const newImage = new Image();
        newImage.src = validImages[currentMonth][currentIndex];
        newImage.onload = () => {
            slideshowImage.classList.remove('fade-in');
            setTimeout(() => {
                slideshowImage.src = newImage.src;
                slideshowImage.classList.add('fade-in');
            }, 50);
        };
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

// Initialize the slideshow
document.addEventListener('DOMContentLoaded', loadSlideshowData);

// Also call loadSlideshowData immediately in case DOMContentLoaded has already fired
loadSlideshowData();