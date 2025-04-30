# Valadez Valor Family Site Documentation

## Overview:

The Valadez Valor site is a web-based application designed for the Valadez family. It serves as a central hub for viewing shared memories (photo slideshows and videos), accessing family information like birthdays and name meanings, and linking to archived newsletters. It's designed to be hosted on GitHub Pages, providing an accessible platform for family members.

Valadez Vine past issues:
https://us9.campaign-archive.com/home/?u=c69f6591ff871e2b9a315b29b&id=2abc3a3d56
Update new issues every new newsletter from links on this page

---

## Key Features:

1.  **Dynamic Navigation:**
    *   A responsive, sticky top navigation bar (`navbar.js`, `navbar.html`, `navbar.css`) provides access to all site sections.
    *   The "Slideshows" dropdown is dynamically populated based on entries in `slideshow_data.json`.
    *   Navigation uses standard links, URL hash changes (for image slideshows), and URL parameters (for generic videos).
    *   Active link highlighting indicates the current section.

2.  **Image Slideshows (`index.html`):**
    *   Displays photo collections with synchronized background music based on `slideshow_data.json` entries where `type` is "image".
    *   Includes Play/Pause, Next/Previous controls, and an image counter.
    *   Features automatic advancement with customizable intervals per slideshow.
    *   Includes audio controls (mute/unmute).

3.  **Video Player (`video-player.html`):**
    *   A generic video player page that displays videos linked from the "Slideshows" dropdown (where `type` is "video" in `slideshow_data.json`).
    *   Loads video source and title dynamically based on URL parameters.
    *   Uses standard HTML5 video controls.
    *   Sets a default initial volume (50%).

4.  **Birthday Information:**
    *   **Monthly View (`birthdays.html`):** Displays birthdays grouped and sorted by month, fetched from `birthdays.json`.
    *   **Alphabetical List (`list-of-names.html`):** Displays names and birth dates sorted alphabetically by last name, fetched from `birthdays.json`.

5.  **Newsletter Archive (`newsletter-archive.html`):**
    *   A static page providing links to past family newsletters hosted externally (e.g., Mailchimp).

6.  **Name Meanings (`name-meanings.html`):**
    *   Displays a list of family names and their meanings, parsed from inline data within the HTML file.

7.  **Responsive Design:**
    *   The layout, navigation, and content display adapt to various screen sizes and orientations (desktop, tablet, mobile portrait/landscape) using CSS media queries.

---

## File Structure Overview:

```
valadezfamily/
├── assets/              # Contains images, music, video subdirectories
│   ├── images/
│   ├── music/
│   └── video/
├── components/
│   └── navbar.html      # Reusable navbar structure
├── css/
│   └── navbar.css       # Styles specific to the navbar
├── js/
│   ├── navbar.js        # Logic for loading navbar, populating dropdowns, interactivity
│   └── video-player.js  # Logic for the generic video player page
├── birthdays.html       # Page for monthly birthday view
├── birthdays.json       # Data source for birthday information
├── DOCUMENTATION.txt    # This file
├── index.html           # Main page, hosts the image slideshow player
├── list-of-names.html   # Page for alphabetical birthday list
├── name-meanings.html   # Page displaying name meanings
├── newsletter-archive.html # Page linking to newsletter archives
├── script.js            # Core logic for the image slideshow player on index.html
├── slideshow_data.json  # Data source for slideshows (images/audio) and videos
├── style.css            # Global and base styles for the site
├── video-player.html    # Generic page for displaying single videos
└── ... (other potential files like old/, bin/, data/)
```

---

## Core Components/Pages:

1.  **Image Slideshow (`index.html`, `script.js`)**
    *   **HTML:** Contains the structure for the slideshow display area (`#slideshow-container`, `#slideshow-image`), controls, audio element, and navbar placeholder.
    *   **JS:** Handles loading `slideshow_data.json`, validating image entries, preloading images, displaying images sequentially, managing audio playback (play/pause, next track, mute), handling user controls, and responding to hash changes for navigation.

2.  **Generic Video Player (`video-player.html`, `js/video-player.js`)**
    *   **HTML:** Provides a container (`#video-container`) and a standard `<video>` element (`#video-player-element`), along with a title heading and navbar placeholder.
    *   **JS:** Reads `video` and `title` URL parameters, sets the `src` attribute of the video element, sets the page and heading titles, and sets the initial video volume.

3.  **Navbar (`components/navbar.html`, `css/navbar.css`, `js/navbar.js`)**
    *   **HTML Component:** Defines the structure of the navigation bar, including brand, toggler button (for mobile), and unordered lists for nav items and dropdowns. Includes placeholders (`#navbar-placeholder`) in main HTML files.
    *   **CSS:** Styles the navbar appearance, responsiveness (desktop vs. mobile layout), dropdown menus, and active link states.
    *   **JS:** Fetches and injects `navbar.html` into placeholders, fetches `slideshow_data.json` to dynamically populate the "Slideshows" dropdown, handles the mobile toggle functionality, manages dropdown behavior (hover/click), and sets the active link based on the current page URL/hash/parameters.

4.  **Birthday Features (`birthdays.html`, `list-of-names.html`, `birthdays.json`)**
    *   **`birthdays.json`:** Simple JSON array containing objects with "name" and "date" (MM-DD) properties.
    *   **`birthdays.html`:** Fetches `birthdays.json`, groups entries by month, sorts within months by day, and renders them as styled lists.
    *   **`list-of-names.html`:** Fetches `birthdays.json`, parses names (attempting last/first), sorts alphabetically by last name then first name, and renders the list in a table with formatted dates.

5.  **Newsletter Archive (`newsletter-archive.html`)**
    *   A simple, static HTML page containing a list of links pointing to external newsletter URLs. Includes the standard navbar.

6.  **Name Meanings (`name-meanings.html`)**
    *   A static HTML page that parses name-meaning pairs from a multi-line string embedded within its own `<script>` tag. It then sorts the names alphabetically and renders them in a list format. Includes the standard navbar.

7.  **Global Styles (`style.css`)**
    *   Defines base styles (fonts, colors, background), global element styling (body, main), layout adjustments, responsive media queries, and specific styles for the image slideshow (`index.html`) and video player pages (shared styles for `video-player.html`).

8.  **Data Files (`slideshow_data.json`, `birthdays.json`)**
    *   **`slideshow_data.json`:** A JSON object where keys are the slideshow/video titles (e.g., "April 2024", "Rachel's Video"). Each value is an object containing:
        *   `type`: ("image" or "video") - *Crucial* field added.
        *   `imageCount`: (For `type: "image"`) Declared number of images.
        *   `images`: (For `type: "image"`) Array of image file paths.
        *   `audio`: (For `type: "image"`) Array of audio file paths.
        *   `interval`: (For `type: "image"`) Slideshow interval in milliseconds.
        *   `videoSrc`: (For `type: "video"`) Path to the video file.
    *   **`birthdays.json`:** A JSON array of objects, each with `name` (string) and `date` (string, "MM-DD").

---

## Core Systems/Concepts:

1.  **Data Loading & Rendering:**
    *   Uses the `fetch` API extensively (in `navbar.js`, `script.js`, birthday pages) to load JSON data (`slideshow_data.json`, `birthdays.json`).
    *   Dynamically generates HTML content based on fetched data (navbar dropdowns, birthday lists, slideshow images/audio sources, video player source).

2.  **Navigation:**
    *   **Navbar:** Primary navigation element, loaded dynamically. Links point directly to HTML pages or use specific formats for dynamic content.
    *   **Hash Navigation (`index.html`):** URL hash (`#Month%20Year`) is used to select and load specific image slideshows via the `hashchange` event listener in `script.js`.
    *   **URL Parameters (`video-player.html`):** URL query parameters (`?video=...&title=...`) are used to tell the generic video player which video file to load and what title to display.
    *   **Active State:** `navbar.js` determines and applies `.active` and `.active-parent` classes to links based on the current URL, hash, or parameters.

3.  **Image Handling (`script.js`):**
    *   **Validation (`validateImages`):** Checks image entries in `slideshow_data.json`, filters duplicates, and optionally checks if image files exist (if `ENABLE_PRELOAD_VALIDATION` is true). Populates the `validImages` object.
    *   **Preloading (`ImagePreloader`, `preloadImages`):** Proactively loads upcoming images in the current slideshow into an in-memory cache (`ImagePreloader`) to improve display speed.
    *   **Display (`updateImage`):** Sets the `src` of the main slideshow image element, handles loading states (`alt` text), and manages `onload`/`onerror` events.
    *   **Sizing (`adjustImageSize`):** Dynamically calculates and applies CSS `width`/`height` to the image element to ensure it fits within the container while maintaining aspect ratio (`object-fit: contain`).

4.  **Audio Handling (`script.js`):**
    *   Uses the standard HTML5 `<audio>` element.
    *   `updateAudio`: Loads the correct audio track(s) for the current image slideshow.
    *   `moveToNextAudio`: Cycles through available audio tracks when one ends or restarts a single track.
    *   Handles play/pause synchronization with the slideshow state and user mute control.

5.  **Video Handling (`js/video-player.js`, `navbar.js`):**
    *   `navbar.js` identifies video entries in `slideshow_data.json` and generates links to `video-player.html` with appropriate URL parameters.
    *   `video-player.js` parses these parameters, sets the `<video>` element's `src`, handles basic error checking, sets the page title, and applies a default volume.

6.  **Responsiveness (`style.css`, `css/navbar.css`):**
    *   Extensive use of CSS media queries to adjust layout, font sizes, element visibility (navbar toggle), container sizing, and spacing for different screen sizes and orientations. Flexbox is used for layout management.