const images = [
    'images/march/photo.jpg',
    'images/march/photo (1).jpg',
    'images/march/photo (2).jpg',
    'images/march/photo (3).jpg',
    'images/march/photo (4).jpg',
    'images/march/photo (5).jpg',
    'images/march/photo (6).jpg',
    'images/march/photo (7).jpg',
    'images/march/photo (9).jpg',
    'images/march/photo (10).jpg',
    'images/march/photo (11).jpg',
    'images/march/photo (12).jpg',
    'images/march/photo (13).jpg',
    'images/march/photo (14).jpg',
    'images/march/photo (15).jpg',
    'images/march/photo (16).jpg',
    'images/march/photo (17).jpg',
    'images/march/photo (18).jpg',
    'images/march/photo (19).jpg',
    'images/march/photo (20).jpg',
    'images/march/photo (22).jpg',
    'images/march/photo (23).jpg',
    'images/march/photo (24).jpg',
    'images/march/photo (25).jpg',
    'images/march/photo (26).jpg',
    'images/march/photo (27).jpg',
    'images/march/photo (28).jpg',
    'images/march/photo (29).jpg',
    'images/march/photo (30).jpg',
    'images/march/photo (31).jpg',
    'images/march/photo (32).jpg',
    'images/march/photo (33).jpg',
    'images/march/photo (34).jpg',
    'images/march/photo (35).jpg',
    'images/march/photo (36).jpg',
    'images/march/photo (37).jpg',
    'images/march/photo (38).jpg',
    'images/march/photo (39).jpg',
    'images/march/photo (40).jpg',
    'images/march/photo (41).jpg',
    'images/march/photo (42).jpg',
    'images/march/photo (43).jpg',
    'images/march/photo (44).jpg',
    'images/march/photo (45).jpg',
    'images/march/photo (46).jpg',
    'images/march/photo (47).jpg',
    'images/march/photo (48).jpg',
    'images/march/photo (49).jpg',
    'images/march/photo (50).jpg',
    'images/march/photo (51).jpg',
    'images/march/photo (52).jpg',
    'images/march/photo (53).jpg',
    'images/march/photo (54).jpg',
    'images/march/photo (55).jpg',
    'images/march/photo (56).jpg',
    'images/march/photo (57).jpg',
    'images/march/photo (58).jpg',
    'images/march/photo (59).jpg',
    'images/march/photo (60).jpg'
];

let currentIndex = 0;
let slideshowInterval = null;
let isSlideshowPlaying = false;

const slideshowImage = document.getElementById('slideshow-image');
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
        pauseSlideshowButton.innerHTML = '<i class="fas fa-play"></i>';
        audioElement.pause();
        audioControlButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        slideshowInterval = setInterval(moveToNextImage, 6000);
        pauseSlideshowButton.innerHTML = '<i class="fas fa-pause"></i>';
        audioElement.play().catch(error => console.error("Audio play failed:", error));
        audioControlButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
    isSlideshowPlaying = !isSlideshowPlaying;
};

pauseSlideshowButton.addEventListener('click', () => {
    toggleSlideshow();
});

nextButton.addEventListener('click', () => {
    moveToNextImage();
    if (isSlideshowPlaying) {
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(moveToNextImage, 6000);
    }
});

prevButton.addEventListener('click', () => {
    moveToPrevImage();
    if (isSlideshowPlaying) {
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(moveToNextImage, 6000);
    }
});

audioControlButton.addEventListener('click', () => {
    audioElement.muted = !audioElement.muted;
    audioControlButton.innerHTML = audioElement.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
});

updateImage(currentIndex);
