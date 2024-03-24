const images = [
    'images/april/Photo.jpg',
    'images/april/Photo (1).jpg',
    'images/april/Photo (2).jpg',
    'images/april/Photo (3).jpg',
    'images/april/Photo (4).jpg',
    'images/april/Photo (5).jpg',
    'images/april/Photo (6).jpg',
    'images/april/Photo (7).jpg',
    'images/april/Photo (9).jpg',
    'images/april/Photo (10).jpg',
    'images/april/Photo (11).jpg',
    'images/april/Photo (12).jpg',
    'images/april/Photo (13).jpg',
    'images/april/Photo (14).jpg',
    'images/april/Photo (15).jpg',
    'images/april/Photo (16).jpg',
    'images/april/Photo (17).jpg',
    'images/april/Photo (18).jpg',
    'images/april/Photo (19).jpg',
    'images/april/Photo (20).jpg',
    'images/april/Photo (22).jpg',
    'images/april/Photo (23).jpg',
    'images/april/Photo (24).jpg',
    'images/april/Photo (25).jpg',
    'images/april/Photo (26).jpg',
    'images/april/Photo (27).jpg',
    'images/april/Photo (28).jpg',
    'images/april/Photo (29).jpg',
    'images/april/Photo (30).jpg',
    'images/april/Photo (31).jpg',
    'images/april/Photo (32).jpg',
    'images/april/Photo (33).jpg',
    'images/april/Photo (34).jpg',
    'images/april/Photo (35).jpg',
    'images/april/Photo (36).jpg',
    'images/april/Photo (37).jpg',
    'images/april/Photo (38).jpg',
    'images/april/Photo (39).jpg',
    'images/april/Photo (40).jpg',
    'images/april/Photo (41).jpg',
    'images/april/Photo (42).jpg',
    'images/april/Photo (43).jpg',
    'images/april/Photo (44).jpg',
    'images/april/Photo (45).jpg',
    'images/april/Photo (46).jpg',
    'images/april/Photo (47).jpg',
    'images/april/Photo (48).jpg',
    'images/april/Photo (49).jpg',
    'images/april/Photo (50).jpg',
    'images/april/Photo (51).jpg',
    'images/april/Photo (52).jpg',
    'images/april/Photo (53).jpg',
    'images/april/Photo (54).jpg',
    'images/april/Photo (55).jpg',
    'images/april/Photo (56).jpg',
    'images/april/Photo (57).jpg',
    'images/april/Photo (58).jpg',
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
        slideshowInterval = setInterval(moveToNextImage, 5000); // Change image every 3 seconds
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