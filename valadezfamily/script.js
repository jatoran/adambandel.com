const images = [
    'images/photo.jpg',
    'images/photo (1).jpg',
    'images/photo (2).jpg',
    'images/photo (3).jpg',
    'images/photo (4).jpg',
    'images/photo (5).jpg',
    'images/photo (6).jpg',
    'images/photo (7).jpg',
    'images/photo (9).jpg',
    'images/photo (10).jpg',
    'images/photo (11).jpg',
    'images/photo (12).jpg',
    'images/photo (13).jpg',
    'images/photo (14).jpg',
    'images/photo (15).jpg',
    'images/photo (16).jpg',
    'images/photo (17).jpg',
    'images/photo (18).jpg',
    'images/photo (19).jpg',
    'images/photo (20).jpg',
    'images/photo (21).jpg',
    'images/photo (22).jpg',
    'images/photo (23).jpg',
    'images/photo (24).jpg',
    'images/photo (25).jpg'
];

let currentIndex = 0;
let slideshowInterval = null;
let isSlideshowPlaying = false;

const slideshowImage = document.getElementById('slideshow-image');
const startSlideshowButton = document.getElementById('start-slideshow');
const pauseSlideshowButton = document.getElementById('play-pause-slideshow');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const audioElement = document.getElementById('background-audio');
const audioControlButton = document.getElementById('audio-control');

const updateImage = (index) => {
    slideshowImage.src = images[index];
};

const moveToNextImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage(currentIndex);
};

const moveToPrevImage = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage(currentIndex);
};

const toggleSlideshow = () => {
    if (isSlideshowPlaying) {
        clearInterval(slideshowInterval);
        pauseSlideshowButton.innerHTML = '<i class="fas fa-play"></i>'; // Change to play icon
        audioElement.pause(); // Pause the audio when the slideshow is paused
        audioControlButton.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Update audio control button to reflect muted state
    } else {
        slideshowInterval = setInterval(moveToNextImage, 3000); // Change image every 3 seconds
        pauseSlideshowButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change to pause icon
        audioElement.play().catch(error => console.error("Audio play failed:", error)); // Play the audio when the slideshow starts
        audioControlButton.innerHTML = '<i class="fas fa-volume-up"></i>'; // Update audio control button to reflect unmuted state
    }
    isSlideshowPlaying = !isSlideshowPlaying;
};


// Simplify the event listeners
startSlideshowButton.addEventListener('click', function() {
    toggleSlideshow(); // Start the slideshow immediately
    this.style.display = 'none'; // Hide start button
    pauseSlideshowButton.style.display = 'inline-block'; // Show the pause button
    audioElement.play().catch(error => console.error("Audio play failed:", error));
});

pauseSlideshowButton.addEventListener('click', toggleSlideshow);

nextButton.addEventListener('click', () => {
    moveToNextImage();
    if (isSlideshowPlaying) {
        // Reset slideshow timer for a full interval before next auto-transition
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(moveToNextImage, 3000);
    }
});

prevButton.addEventListener('click', () => {
    moveToPrevImage();
    if (isSlideshowPlaying) {
        // Reset slideshow timer for a full interval before next auto-transition
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(moveToNextImage, 3000);
    }
});

// Audio control with icons
audioControlButton.addEventListener('click', function() {
    if (audioElement.muted) {
        audioElement.muted = false;
        this.innerHTML = '<i class="fas fa-volume-up"></i>'; // Unmuted icon
    } else {
        audioElement.muted = true;
        this.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Muted icon
    }
});

// Initialize slideshow with the first image
updateImage(currentIndex);