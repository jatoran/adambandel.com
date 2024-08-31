// main.js
import { initAudio, loadAudio, playAudioWithFade, moveToNextAudio, updateAudio } from './audioManager.js';
import { loadSlideshowData, validateImages, updateImage, moveToNextImage, moveToPrevImage, setMonth, resetSlideshow } from './slideshowManager.js';
import { setupUI, updateNavArrows, adjustImageSize, updateImageCounter } from './uiManager.js';

let currentMonth = '';
let currentIndex = 0;
let currentAudioIndex = 0;
let slideshowInterval = null;
let isSlideshowPlaying = false;
let slideshowData = {};
let isInitialized = false;
let validImages = {}; 
let isTestMode = false;
let testModeDuration = 10;
let fadeOutTimeout;
let nextAudioTimeout;
let isMuted = false;
let audioStartTime = 0;
let audioPausedAt = 0;

export { 
    currentMonth, currentIndex, currentAudioIndex, slideshowInterval, isSlideshowPlaying, 
    slideshowData, isInitialized, validImages, isTestMode, testModeDuration, 
    fadeOutTimeout, nextAudioTimeout, isMuted, audioStartTime, audioPausedAt
};

async function init() {
    await loadSlideshowData();
    initAudio();
    setupUI();

    if (window.location.pathname.includes('rachel.html')) {
        currentMonth = "Rachel's Video";
        document.getElementById('current-month').textContent = "Rachel's Video";
    }

    window.addEventListener('resize', () => {
        adjustImageSize();
        updateNavArrows();
    });

    window.addEventListener('hashchange', () => {
        const month = decodeURIComponent(window.location.hash.slice(1));
        if (slideshowData[month]) {
            setMonth(month);
        }
    });

    document.addEventListener('click', function initializeAudio() {
        if (!window.audioContext) {
            initAudio();
        }
        document.removeEventListener('click', initializeAudio);
    }, { once: true });
}

document.addEventListener('DOMContentLoaded', init);