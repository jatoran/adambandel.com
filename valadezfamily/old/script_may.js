const images = [
    'images/may/Photo.jpg',
    'images/may/Photo (1).jpg',
    'images/may/Photo (2).jpg',
    'images/may/Photo (3).jpg',
    'images/may/Photo (14).jpg',
    'images/may/Photo (15).jpg',
    'images/may/Photo (17).jpg',
    'images/may/Photo (18).jpg',
    'images/may/Photo (19).jpg',
    'images/may/Photo (5).jpg',
    'images/may/Photo (11).jpg',
    'images/may/Photo (22).jpg',
    'images/may/Photo (23).jpg',
    'images/may/Photo (25).jpg',
    'images/may/Photo (26).jpg',
    'images/may/Photo (6).jpg',
    'images/may/Photo (27).jpg',
    'images/may/Photo (28).jpg',
    'images/may/Photo (29).jpg',
    'images/may/Photo (30).jpg',
    'images/may/Photo (31).jpg',
    'images/may/Photo (7).jpg',
    'images/may/Photo (32).jpg',
    'images/may/Photo (33).jpg',
    'images/may/Photo (34).jpg',
    'images/may/Photo (44).jpg',
    'images/may/Photo (45).jpg',
    'images/may/Photo (16).jpg',
    'images/may/Photo (35).jpg',
    'images/may/Photo (36).jpg',
    'images/may/Photo (37).jpg',
    'images/may/Photo (38).jpg',
    'images/may/Photo (39).jpg',
    'images/may/Photo (8).jpg',
    'images/may/Photo (9).jpg',
    'images/may/Photo (40).jpg',
    'images/may/Photo (41).jpg',
    'images/may/Photo (42).jpg',
    'images/may/Photo (43).jpg',
    'images/may/Photo (46).jpg',
    'images/may/Photo (47).jpg',
    'images/may/Photo (10).jpg',
    'images/may/Photo (24).jpg',
    'images/may/Photo (48).jpg',
    'images/may/Photo (49).jpg',
    'images/may/Photo (50).jpg',
    'images/may/Photo (51).jpg',
    'images/may/Photo (20).jpg',
    'images/may/Photo (52).jpg',
    'images/may/Photo (53).jpg',
    'images/may/Photo (54).jpg',
    'images/may/Photo (55).jpg',
    'images/may/Photo (4).jpg',
    'images/may/Photo (12).jpg',
    'images/may/Photo (56).jpg',
    'images/may/Photo (57).jpg',
    'images/may/Photo (58).jpg',
    'images/may/Photo (59).jpg',
    'images/may/Photo (61).jpg',
    'images/may/Photo (62).jpg',
    'images/may/Photo (13).jpg',
    'images/may/Photo (63).jpg',
    'images/may/Photo (64).jpg',
    'images/may/Photo (65).jpg',
    'images/may/Photo (66).jpg',
    'images/may/Photo (67).jpg',
    'images/may/Photo (68).jpg',
    'images/may/Photo (60).jpg',
    'images/may/Photo (69).jpg',
    'images/may/Photo (70).jpg',
    'images/may/Photo (71).jpg',
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
