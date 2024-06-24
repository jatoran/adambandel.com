const images = [
     'images/july/Photo (10).jpg',
     'images/july/Photo (20).jpg',
     'images/july/Photo (53).jpg',
     'images/july/Photo (36).jpg',
     'images/july/Photo (42).jpg',
     'images/july/Photo (38).jpg',
     'images/july/Photo (34).jpg',
     'images/july/Photo.jpg', 
     'images/july/Photo (48).jpg',
     'images/july/Photo (24).jpg',
     'images/july/Photo (8).jpg',
     'images/july/Photo (6).jpg',
     'images/july/Photo (26).jpg',
     'images/july/Photo (19).jpg',
     'images/july/Photo (15).jpg',
     'images/july/Photo (18).jpg',
     'images/july/Photo (13).jpg',
     'images/july/Photo (23).jpg',
     'images/july/Photo (56).jpg',
     'images/july/Photo (9).jpg',
     'images/july/Photo (44).jpg',
     'images/july/Photo (40).jpg',
     'images/july/Photo (41).jpg',
     'images/july/Photo (16).jpg',
     'images/july/Photo (2).jpg',
     'images/july/Photo (28).jpg',
     'images/july/Photo (1).jpg',
     'images/july/Photo (46).jpg',
     'images/july/Photo (45).jpg',
     'images/july/Photo (57).jpg',
     'images/july/Photo (58).jpg',
     'images/july/Photo (59).jpg',
     'images/july/Photo (60).jpg',
     'images/july/Photo (61).jpg',
     'images/july/Photo (62).jpg',
     'images/july/Photo (63).jpg',
     'images/july/Photo (64).jpg',
     'images/july/Photo (65).jpg',
     'images/july/Photo (66).jpg',
     'images/july/Photo (67).jpg',
     'images/july/Photo (68).jpg',
     'images/july/Photo (32).jpg',
     'images/july/Photo (37).jpg',
     'images/july/Photo (3).jpg',
     'images/july/Photo (55).jpg',
     'images/july/Photo (35).jpg',
     'images/july/Photo (51).jpg',
     'images/july/Photo (31).jpg',
     'images/july/Photo (4).jpg',
     'images/july/Photo (29).jpg',
     'images/july/Photo (22).jpg',
     'images/july/Photo (33).jpg',
     'images/july/Photo (49).jpg',
     'images/july/Photo (50).jpg',
     'images/july/Photo (25).jpg',
     'images/july/Photo (7).jpg',
     'images/july/Photo (52).jpg',
     'images/july/Photo (12).jpg',
     'images/july/Photo (54).jpg',
     'images/july/Photo (47).jpg',
     'images/july/Photo (39).jpg',
     'images/july/Photo (14).jpg',
     'images/july/Photo (11).jpg',
     'images/july/Photo (43).jpg',
     'images/july/Photo (5).jpg',
     'images/july/Photo (27).jpg',
     'images/july/Photo (30).jpg',
     'images/july/Photo (17).jpg'
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
