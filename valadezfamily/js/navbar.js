// valadezfamily/js/navbar.js

document.addEventListener('DOMContentLoaded', () => {
    loadNavbarAndData();
});

async function loadNavbarAndData() {
    const navbarPlaceholder = document.getElementById('navbar-placeholder');
    if (!navbarPlaceholder) {
        console.error('Navbar placeholder not found!');
        return;
    }

    // Fetch navbar HTML and slideshow data concurrently
    try {
        // Use relative paths from the HTML document location
        const [navbarHtmlResponse, slideshowDataResponse] = await Promise.all([
            fetch('components/navbar.html'),
            fetch('slideshow_data.json') // Assumes it's in the root
        ]);

        if (!navbarHtmlResponse.ok) {
            throw new Error(`HTTP error loading navbar HTML! status: ${navbarHtmlResponse.status}`);
        }
        if (!slideshowDataResponse.ok) {
            throw new Error(`HTTP error loading slideshow data! status: ${slideshowDataResponse.status}`);
        }

        const navbarHtml = await navbarHtmlResponse.text();
        const slideshowData = await slideshowDataResponse.json();

        // Insert navbar HTML
        navbarPlaceholder.innerHTML = navbarHtml;

        // Populate the slideshow dropdown
        populateSlideshowDropdown(slideshowData);

        // Initialize navbar interactivity
        initializeNavbar();

        // Set the active link based on the current page/hash
        setActiveLink();

    } catch (error) {
        console.error('Error loading navbar or slideshow data:', error);
        navbarPlaceholder.innerHTML = '<p style="color: red; text-align: center; background-color: #eee; padding: 10px;">Error loading navigation.</p>';
    }
}

function populateSlideshowDropdown(slideshowData) {
    const dropdownMenu = document.getElementById('slideshows-dropdown-menu');
    if (!dropdownMenu) {
        console.error("Slideshow dropdown menu ('slideshows-dropdown-menu') not found!");
        return;
    }

    dropdownMenu.innerHTML = ''; // Clear the 'Loading...' item

    const monthKeys = Object.keys(slideshowData);

    // Optional: Sort keys if needed (e.g., reverse chronologically as they appear in JSON)
    // monthKeys.sort((a, b) => { /* custom sorting logic */ });

    monthKeys.forEach(key => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.classList.add('dropdown-item');
        a.textContent = key; // e.g., "April 2025" or "Rachel's Video"

        if (slideshowData[key].type === 'video' && key === "Rachel's Video") {
            a.href = 'rachel.html';
        } else {
            // Assume it's a regular image slideshow month
            a.href = `index.html#${encodeURIComponent(key)}`;
        }

        li.appendChild(a);
        dropdownMenu.appendChild(li);
    });
}


function initializeNavbar() {
    const toggler = document.getElementById('navbar-toggler');
    const collapse = document.getElementById('navbar-collapse');
    const dropdownToggles = document.querySelectorAll('.navbar-nav .dropdown-toggle');

    if (!toggler || !collapse) {
        console.error('Navbar toggler or collapse element not found after loading.');
        return; // Exit if core elements are missing
    }

    toggler.addEventListener('click', () => {
        const isActive = collapse.classList.toggle('active');
        toggler.classList.toggle('active', isActive); // Sync toggler animation class
        toggler.setAttribute('aria-expanded', isActive); // Accessibility

        // If closing menu, also close any open mobile dropdowns
        if (!isActive) {
             document.querySelectorAll('.nav-item.dropdown.open').forEach(openDropdown => {
                 openDropdown.classList.remove('open');
                 openDropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
             });
        }
    });

    // Handle dropdown clicks specifically for mobile (preventing page jump)
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Check if we are in mobile view (toggler is visible)
            if (window.getComputedStyle(toggler).display !== 'none') {
                e.preventDefault(); // Prevent default link behavior ONLY on mobile
                const parentItem = toggle.closest('.nav-item.dropdown');
                if (parentItem) {
                     const isOpen = parentItem.classList.toggle('open');
                     toggle.setAttribute('aria-expanded', isOpen); // Accessibility

                     // Close other open dropdowns
                     document.querySelectorAll('.nav-item.dropdown.open').forEach(openDropdown => {
                         if (openDropdown !== parentItem) {
                             openDropdown.classList.remove('open');
                             openDropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                         }
                     });
                }
            }
            // On desktop, the default hover behavior handles it (CSS), and '#' links do nothing.
        });
    });

    // Close mobile menu if clicking outside of it
    document.addEventListener('click', (e) => {
        if (collapse.classList.contains('active')) {
            // Ensure the click target is not the toggler itself or within the opened menu
            const isClickInsideNavbar = collapse.contains(e.target);
            const isToggler = toggler.contains(e.target);

            if (!isClickInsideNavbar && !isToggler) {
                collapse.classList.remove('active');
                toggler.classList.remove('active');
                toggler.setAttribute('aria-expanded', 'false');
                // Close any open mobile dropdowns too
                document.querySelectorAll('.nav-item.dropdown.open').forEach(openDropdown => {
                    openDropdown.classList.remove('open');
                    openDropdown.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded', 'false');
                });
            }
        }
    });
}

function setActiveLink() {
    const navLinks = document.querySelectorAll('#navbar-collapse .nav-link, #navbar-collapse .dropdown-item');
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;

    // Normalize page name (e.g., handle '/' or '/index.html')
    let pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
    if (pageName === '' || pageName === 'index.html') {
        pageName = 'index.html'; // Consistent base name
    }

    navLinks.forEach(link => {
        link.classList.remove('active', 'active-parent'); // Clear previous active states

        const linkHref = link.getAttribute('href');
        if (!linkHref) return;

        const linkUrl = new URL(linkHref, window.location.origin); // Resolve relative URLs
        const linkPageName = linkUrl.pathname.substring(linkUrl.pathname.lastIndexOf('/') + 1) || 'index.html';
        const linkHash = linkUrl.hash;

        let isActive = false;

        // --- Matching Logic ---
        // 1. Exact page match (ignoring hash unless it's the only difference)
        if (linkPageName === pageName && (linkHash === currentHash || linkHash === '' || currentHash === '')) {
             // Special case: If on index.html, only activate slideshow link if hash matches
            if (pageName === 'index.html' && linkPageName === 'index.html' && link.classList.contains('dropdown-item')) {
                 if (linkHash === currentHash) {
                    isActive = true;
                 }
            }
             // Handle non-slideshow index.html link (like a potential "Home" link if added later)
             else if (pageName === 'index.html' && linkPageName === 'index.html' && !link.closest('#slideshows-dropdown-menu')) {
                 // Only activate if there's no hash, or the link also has no hash
                 if (currentHash === '' && linkHash === '') {
                    isActive = true;
                 }
             }
             // Activate other pages directly
             else if (pageName !== 'index.html') {
                 isActive = true;
             }
        }

        // 2. Handle slideshow links specifically when on index.html with a hash
        if (pageName === 'index.html' && currentHash !== '' && linkPageName === 'index.html' && linkHash === currentHash) {
             isActive = true;
        }
        // --- End Matching Logic ---


        if (isActive) {
            link.classList.add('active');

            // If the active link is inside a dropdown, mark the parent toggle
            const dropdownItemParent = link.closest('.dropdown-menu');
            if (dropdownItemParent) {
                const dropdownToggle = dropdownItemParent.closest('.nav-item.dropdown')?.querySelector('.dropdown-toggle');
                 if (dropdownToggle) {
                    // Use a different class to avoid styling the toggle exactly like an active link
                     dropdownToggle.classList.add('active-parent');
                 }
            }
        }
    });
}

// Optional: Add a simple style for active-parent if desired in navbar.css
/*
.nav-link.active-parent {
    background-color: rgba(255, 255, 255, 0.05); // Very subtle indication
}
*/