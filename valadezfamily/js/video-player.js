// valadezfamily/js/video-player.js

document.addEventListener('DOMContentLoaded', () => {
    loadVideoFromParams();
});

function loadVideoFromParams() {
    const videoElement = document.getElementById('video-player-element');
    const titleElement = document.getElementById('video-page-title');
    const pageTitleTag = document.querySelector('title'); // Get the <title> tag

    if (!videoElement || !titleElement || !pageTitleTag) {
        console.error('Required elements (video player, title h1, or title tag) not found.');
        if (titleElement) titleElement.textContent = 'Error: Page setup failed.';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const videoSrc = urlParams.get('video');
    const videoTitle = urlParams.get('title'); // Get the title passed from navbar.js

    if (videoSrc) {
        console.log(`Loading video: ${videoSrc}`);
        // Basic validation: ensure it's not an obviously malicious path
        if (videoSrc.includes('../')) {
             console.error('Invalid video path detected.');
             titleElement.textContent = 'Error: Invalid Video Path';
             pageTitleTag.textContent = 'Error - Valadez Family';
             videoElement.parentElement.innerHTML = '<p class="error-message">Invalid video source specified.</p>';
             return;
        }

        // Clear any existing sources just in case
        while (videoElement.firstChild) {
            videoElement.removeChild(videoElement.firstChild);
        }

        // Create and append the source element
        const sourceElement = document.createElement('source');
        sourceElement.setAttribute('src', videoSrc);
        const extension = videoSrc.split('.').pop()?.toLowerCase();
        if (extension === 'mp4') {
            sourceElement.setAttribute('type', 'video/mp4');
        } else if (extension === 'webm') {
            sourceElement.setAttribute('type', 'video/webm');
        } else if (extension === 'ogv' || extension === 'ogg') {
            sourceElement.setAttribute('type', 'video/ogg');
        } else {
            console.warn(`Unknown video extension: ${extension}. Browser might not play it.`);
        }
        videoElement.appendChild(sourceElement);
        videoElement.appendChild(document.createTextNode('Your browser does not support the video tag.'));

        // Load the video
        videoElement.load();

        // --- SET INITIAL VOLUME ---
        videoElement.volume = 30.; // Set initial volume to 50%
        console.log(`Initial video volume set to: ${videoElement.volume}`);
        // -------------------------

        // Set the titles
        const displayTitle = videoTitle || 'Family Video';
        titleElement.textContent = displayTitle;
        pageTitleTag.textContent = `${displayTitle} - Valadez Family`;

    } else {
        console.error('No video source specified in URL parameters.');
        titleElement.textContent = 'Error: No Video Specified';
        pageTitleTag.textContent = 'Error - Valadez Family';
        videoElement.parentElement.innerHTML = '<p class="error-message">No video source was provided in the link.</p>';
    }
}