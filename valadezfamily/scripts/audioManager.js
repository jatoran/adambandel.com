// audioManager.js
import { currentMonth, currentAudioIndex, isSlideshowPlaying, slideshowData, isTestMode, testModeDuration, isMuted, audioStartTime } from './main.js';

let audioContext;
let gainNode;
let currentSource;
let currentBuffer;
const fadeDuration = 5;

export function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
}

export async function loadAudio(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

export function playAudioWithFade(audioBuffer, fadeIn = true) {
    if (currentSource) {
        fadeOut().then(() => {
            currentSource.stop();
            startNewAudio(audioBuffer, fadeIn);
        });
    } else {
        startNewAudio(audioBuffer, fadeIn);
    }
}

function startNewAudio(audioBuffer, fadeIn = true, startFrom = 0) {
    if (currentSource) {
        currentSource.stop();
    }
    currentSource = audioContext.createBufferSource();
    currentSource.buffer = audioBuffer;
    currentSource.loop = false;
    currentSource.connect(gainNode);

    if (fadeIn && !isMuted) {
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + fadeDuration);
    } else {
        gainNode.gain.setValueAtTime(isMuted ? 0 : 1, audioContext.currentTime);
    }

    currentSource.onended = handleAudioEnd;

    audioStartTime = audioContext.currentTime - startFrom;
    currentSource.start(0, startFrom);

    if (isTestMode) {
        clearTimeout(window.fadeOutTimeout);
        clearTimeout(window.nextAudioTimeout);
        
        window.nextAudioTimeout = setTimeout(() => {
            handleAudioEnd();
        }, (testModeDuration - startFrom) * 1000);
    }
}

function handleAudioEnd() {
    if (!isTestMode) {
        moveToNextAudio();
    }
}

function fadeOut() {
    return new Promise((resolve) => {
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + fadeDuration);
        setTimeout(resolve, fadeDuration * 1000);
    });
}

export async function moveToNextAudio() {
    if (slideshowData[currentMonth] && slideshowData[currentMonth].audio) {
        currentAudioIndex = (currentAudioIndex + 1) % slideshowData[currentMonth].audio.length;
        if (isSlideshowPlaying) {
            await updateAudio();
        }
    }
}

export async function updateAudio() {
    if (!audioContext) {
        initAudio();
    }

    if (slideshowData[currentMonth] && slideshowData[currentMonth].audio) {
        const audioUrl = slideshowData[currentMonth].audio[currentAudioIndex];
        currentBuffer = await loadAudio(audioUrl);

        if (isSlideshowPlaying) {
            startNewAudio(currentBuffer, true);
        }
    }
}