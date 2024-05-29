// const images = [
//     'images/june/Photo.jpg',
//     'images/june/Photo (1).jpg',
//     'images/june/Photo (2).jpg',
//     'images/june/Photo (3).jpg',
//     'images/june/Photo (14).jpg',
//     'images/june/Photo (15).jpg',
//     'images/june/Photo (17).jpg',
//     'images/june/Photo (18).jpg',
//     'images/june/Photo (19).jpg',
//     'images/june/Photo (5).jpg',
//     'images/june/Photo (11).jpg',
//     'images/june/Photo (22).jpg',
//     'images/june/Photo (23).jpg',
//     'images/june/Photo (25).jpg',
//     'images/june/Photo (26).jpg',
//     'images/june/Photo (6).jpg',
//     'images/june/Photo (27).jpg',
//     'images/june/Photo (28).jpg',
//     'images/june/Photo (29).jpg',
//     'images/june/Photo (30).jpg',
//     'images/june/Photo (31).jpg',
//     'images/june/Photo (7).jpg',
//     'images/june/Photo (32).jpg',
//     'images/june/Photo (33).jpg',
//     'images/june/Photo (34).jpg',
//     'images/june/Photo (44).jpg',
//     'images/june/Photo (45).jpg',
//     'images/june/Photo (16).jpg',
//     'images/june/Photo (35).jpg',
//     'images/june/Photo (36).jpg',
//     'images/june/Photo (37).jpg',
//     'images/june/Photo (38).jpg',
//     'images/june/Photo (39).jpg',
//     'images/june/Photo (8).jpg',
//     'images/june/Photo (9).jpg',
//     'images/june/Photo (40).jpg',
//     'images/june/Photo (41).jpg',
//     'images/june/Photo (42).jpg',
//     'images/june/Photo (43).jpg',
//     'images/june/Photo (46).jpg',
//     'images/june/Photo (47).jpg',
//     'images/june/Photo (10).jpg',
//     'images/june/Photo (24).jpg',
//     'images/june/Photo (48).jpg',
//     'images/june/Photo (49).jpg',
//     'images/june/Photo (50).jpg',
//     'images/june/Photo (51).jpg',
//     'images/june/Photo (20).jpg',
//     'images/june/Photo (52).jpg',
//     'images/june/Photo (53).jpg',
//     'images/june/Photo (54).jpg',
//     'images/june/Photo (55).jpg',
//     'images/june/Photo (4).jpg',
//     'images/june/Photo (12).jpg',
//     'images/june/Photo (56).jpg',
//     'images/june/Photo (57).jpg',
//     'images/june/Photo (58).jpg',
//     'images/june/Photo (59).jpg',
//     'images/june/Photo (61).jpg',
//     'images/june/Photo (62).jpg',
//     'images/june/Photo (13).jpg',
//     'images/june/Photo (63).jpg',
//     'images/june/Photo (64).jpg',
//     'images/june/Photo (65).jpg',
//     'images/june/Photo (66).jpg',
//     'images/june/Photo (67).jpg',
//     'images/june/Photo (68).jpg',
//     'images/june/Photo (60).jpg',
//     'images/june/Photo (69).jpg',
//     'images/june/Photo (70).jpg',
//     'images/june/Photo (71).jpg',
// ];

// let currentIndex = 0;
// let slideshowInterval = null;
// let isSlideshowPlaying = false;

// const slideshowImage = document.getElementById('slideshow-image');
// const pauseSlideshowButton = document.getElementById('play-pause-slideshow');
// const prevButton = document.getElementById('prev');
// const nextButton = document.getElementById('next');
// const audioElement = document.getElementById('background-audio');
// const audioControlButton = document.getElementById('audio-control');

// const updateImage = (index) => {
//     slideshowImage.src = images[index];
// };

// const moveToNextImage = () => {
//     currentIndex = (currentIndex + 1) % images.length;
//     updateImage(currentIndex);
// };

// const moveToPrevImage = () => {
//     currentIndex = (currentIndex - 1 + images.length) % images.length;
//     updateImage(currentIndex);
// };

// const toggleSlideshow = () => {
//     if (isSlideshowPlaying) {
//         clearInterval(slideshowInterval);
//         pauseSlideshowButton.innerHTML = '<i class="fas fa-play"></i>'; // Change to play icon
//         audioElement.pause(); // Pause the audio when the slideshow is paused
//         audioControlButton.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Update audio control button to reflect muted state
//     } else {
//         slideshowInterval = setInterval(moveToNextImage, 6000); // Change image every 6 seconds
//         pauseSlideshowButton.innerHTML = '<i class="fas fa-pause"></i>'; // Change to pause icon
//         audioElement.play().catch(error => console.error("Audio play failed:", error)); // Play the audio when the slideshow starts
//         audioControlButton.innerHTML = '<i class="fas fa-volume-up"></i>'; // Update audio control button to reflect unmuted state
//     }
//     isSlideshowPlaying = !isSlideshowPlaying;
// };

// pauseSlideshowButton.addEventListener('click', () => {
//     toggleSlideshow();
//     if (!isSlideshowPlaying) {
//         pauseSlideshowButton.style.display = 'inline-block'; // Show the play/pause button
//     }
// });

// nextButton.addEventListener('click', () => {
//     moveToNextImage();
//     if (isSlideshowPlaying) {
//         // Reset slideshow timer for a full interval before next auto-transition
//         clearInterval(slideshowInterval);
//         slideshowInterval = setInterval(moveToNextImage, 6000);
//     }
// });

// prevButton.addEventListener('click', () => {
//     moveToPrevImage();
//     if (isSlideshowPlaying) {
//         // Reset slideshow timer for a full interval before next auto-transition
//         clearInterval(slideshowInterval);
//         slideshowInterval = setInterval(moveToNextImage, 3000);
//     }
// });

// audioControlButton.addEventListener('click', function() {
//     if (audioElement.muted) {
//         audioElement.muted = false;
//         this.innerHTML = '<i class="fas fa-volume-up"></i>'; // Unmuted icon
//     } else {
//         audioElement.muted = true;
//         this.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Muted icon
//     }
// });

// updateImage(currentIndex);



const images = [
     'images/june/Photo (78).jpg','images/june/Photo.jpg', 'images/june/Photo (1).jpg', 'images/june/Photo (2).jpg', 
    'images/june/Photo (3).jpg', 'images/june/Photo (14).jpg', 'images/june/Photo (15).jpg', 
    'images/june/Photo (17).jpg', 'images/june/Photo (18).jpg', 'images/june/Photo (19).jpg', 
    'images/june/Photo (5).jpg', 'images/june/Photo (11).jpg', 'images/june/Photo (22).jpg', 
    'images/june/Photo (23).jpg', 'images/june/Photo (25).jpg', 'images/june/Photo (26).jpg', 
    'images/june/Photo (6).jpg', 'images/june/Photo (27).jpg', 'images/june/Photo (28).jpg', 
    'images/june/Photo (29).jpg', 'images/june/Photo (30).jpg', 'images/june/Photo (31).jpg', 
    'images/june/Photo (7).jpg', 'images/june/Photo (32).jpg', 'images/june/Photo (33).jpg', 
    'images/june/Photo (34).jpg', 'images/june/Photo (44).jpg', 'images/june/Photo (45).jpg', 
    'images/june/Photo (16).jpg', 'images/june/Photo (35).jpg', 'images/june/Photo (36).jpg', 
    'images/june/Photo (37).jpg', 'images/june/Photo (38).jpg', 'images/june/Photo (39).jpg', 
    'images/june/Photo (8).jpg', 'images/june/Photo (9).jpg', 'images/june/Photo (40).jpg', 
    'images/june/Photo (41).jpg', 'images/june/Photo (42).jpg', 'images/june/Photo (43).jpg', 
    'images/june/Photo (46).jpg', 'images/june/Photo (47).jpg', 'images/june/Photo (10).jpg', 
    'images/june/Photo (24).jpg', 'images/june/Photo (48).jpg', 'images/june/Photo (49).jpg', 
    'images/june/Photo (50).jpg', 'images/june/Photo (51).jpg', 'images/june/Photo (20).jpg', 
    'images/june/Photo (52).jpg', 'images/june/Photo (53).jpg', 'images/june/Photo (54).jpg', 
    'images/june/Photo (55).jpg', 'images/june/Photo (4).jpg', 'images/june/Photo (12).jpg', 
    'images/june/Photo (56).jpg', 'images/june/Photo (57).jpg', 'images/june/Photo (58).jpg', 
    'images/june/Photo (59).jpg', 'images/june/Photo (61).jpg', 'images/june/Photo (62).jpg', 
    'images/june/Photo (13).jpg', 'images/june/Photo (63).jpg', 'images/june/Photo (64).jpg', 
    'images/june/Photo (65).jpg', 'images/june/Photo (66).jpg', 'images/june/Photo (67).jpg', 
    'images/june/Photo (68).jpg', 'images/june/Photo (60).jpg', 'images/june/Photo (69).jpg', 
    'images/june/Photo (70).jpg', 'images/june/Photo (71).jpg', 'images/june/Photo (72).jpg',
    'images/june/Photo (73).jpg', 'images/june/Photo (74).jpg', 'images/june/Photo (75).jpg',
    'images/june/Photo (76).jpg', 'images/june/Photo (77).jpg',
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
