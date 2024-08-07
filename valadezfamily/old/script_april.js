const images = [
    'images/april/Photo.jpg',
    'images/april/Photo (1).jpg',
    'images/april/Photo (2).jpg',
    'images/april/Photo (3).jpg',
    'images/april/Photo (14).jpg',
    'images/april/Photo (15).jpg',
    'images/april/Photo (17).jpg',
    'images/april/Photo (18).jpg',
    'images/april/Photo (19).jpg',
    'images/april/Photo (5).jpg',
    'images/april/Photo (11).jpg',
    'images/april/Photo (22).jpg',
    'images/april/Photo (23).jpg',
    'images/april/Photo (25).jpg',
    'images/april/Photo (26).jpg',
    'images/april/Photo (6).jpg',
    'images/april/Photo (27).jpg',
    'images/april/Photo (28).jpg',
    'images/april/Photo (29).jpg',
    'images/april/Photo (30).jpg',
    'images/april/Photo (31).jpg',
    'images/april/Photo (7).jpg',
    'images/april/Photo (32).jpg',
    'images/april/Photo (33).jpg',
    'images/april/Photo (34).jpg',
    'images/april/Photo (44).jpg',
    'images/april/Photo (45).jpg',
    'images/april/Photo (16).jpg',
    'images/april/Photo (35).jpg',
    'images/april/Photo (36).jpg',
    'images/april/Photo (37).jpg',
    'images/april/Photo (38).jpg',
    'images/april/Photo (39).jpg',
    'images/april/Photo (8).jpg',
    'images/april/Photo (9).jpg',
    'images/april/Photo (40).jpg',
    'images/april/Photo (41).jpg',
    'images/april/Photo (42).jpg',
    'images/april/Photo (43).jpg',
    'images/april/Photo (46).jpg',
    'images/april/Photo (47).jpg',
    'images/april/Photo (72).jpg',
    'images/april/Photo (73).jpg',
    'images/april/Photo (74).jpg',
    'images/april/Photo (10).jpg',
    'images/april/Photo (24).jpg',
    'images/april/Photo (48).jpg',
    'images/april/Photo (49).jpg',
    'images/april/Photo (50).jpg',
    'images/april/Photo (51).jpg',
    'images/april/Photo (20).jpg',
    'images/april/Photo (52).jpg',
    'images/april/Photo (53).jpg',
    'images/april/Photo (54).jpg',
    'images/april/Photo (55).jpg',
    'images/april/Photo (4).jpg',
    'images/april/Photo (12).jpg',
    'images/april/Photo (56).jpg',
    'images/april/Photo (57).jpg',
    'images/april/Photo (58).jpg',
    'images/april/Photo (59).jpg',
    'images/april/Photo (61).jpg',
    'images/april/Photo (62).jpg',
    'images/april/Photo (13).jpg',
    'images/april/Photo (78).jpeg',
    'images/april/Photo (63).jpg',
    'images/april/Photo (64).jpg',
    'images/april/Photo (65).jpg',
    'images/april/Photo (79).jpeg',
    'images/april/Photo (66).jpg',
    'images/april/Photo (67).jpg',
    'images/april/Photo (68).jpg',
    'images/april/Photo (60).jpg',
    'images/april/Photo (69).jpg',
    'images/april/Photo (70).jpg',
    'images/april/Photo (71).jpg',
    'images/april/Photo (75).jpg',
    'images/april/Photo (76).jpg',
    'images/april/Photo (77).jpg'
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
