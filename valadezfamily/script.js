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

const slideshowImage = document.getElementById('slideshow-image');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

const updateImage = (index) => {
    slideshowImage.src = images[index];
};

prevButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage(currentIndex);
});

nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage(currentIndex);
});

// Initialize slideshow with the first image
updateImage(currentIndex);
