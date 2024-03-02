let lines = [];

document.addEventListener('DOMContentLoaded', function() {
    const categoryColors = {
        "CNN": "blue",
        "RNN": "green",
        "LSTM": "red",
        "GAN": "purple",
        "DL": "yellow",
        "TRNS": "pink",
    };

    document.querySelectorAll('[name="displayMethod"]').forEach(radio => {
        radio.addEventListener('change', (event) => {
            const canvas = document.getElementById('spiralCanvas');
            const dataList = document.getElementById('dataList');
            
            if (event.target.value === 'list') {
                canvas.style.display = 'none'; // Hide the canvas
                dataList.style.display = 'block'; // Show the list
            } else if (event.target.value === 'spiral') {
                dataList.style.display = 'none'; // Hide the list
                displaySpiral(); // This already sets canvas display to block
            }
        });
    });

    
    const categories = Object.keys(categoryColors);
    const filterContainer = document.querySelector('.filter-container');

    // Dynamically create checkboxes for each category
    categories.forEach(category => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = category;
        checkbox.value = category;
        checkbox.checked = true;
        checkbox.classList.add('filter-checkbox');

        const label = document.createElement('label');
        label.htmlFor = category;
        label.textContent = category;
        label.style.color = categoryColors[category];

        filterContainer.appendChild(checkbox);
        filterContainer.appendChild(label);
    });

    // Checkbox for non-categorized items
    const noneCheckbox = document.createElement('input');
    noneCheckbox.type = 'checkbox';
    noneCheckbox.id = 'none';
    noneCheckbox.value = 'none';
    noneCheckbox.checked = true;
    noneCheckbox.classList.add('filter-checkbox');

    const noneLabel = document.createElement('label');
    noneLabel.htmlFor = 'none';
    noneLabel.textContent = 'None';
    noneLabel.style.color = 'white'; // Color for non-categorized items

    filterContainer.appendChild(noneCheckbox);
    filterContainer.appendChild(noneLabel);

    fetch('data.csv')
    .then(response => response.text())
    .then(text => {
        lines = parseCSV(text);
        const dataList = document.getElementById('dataList');

        lines.forEach((line, index) => {
            if (index > 0 && line.length > 1) {
                const category = line[1].trim();
                const effectiveCategory = categoryColors[category] ? category : 'none';
                const color = categoryColors[effectiveCategory] || "white"; 

                const listItem = document.createElement('li');
                listItem.className = 'data-item';
                listItem.dataset.category = effectiveCategory;
                listItem.innerHTML = `
                    <h3 style="color: ${color};">${line[2]} (${line[0]})</h3>
                    <p><strong>Category:</strong> <span style="color: ${color};">${category || 'None'}</span></p>
                    <p>${line[3]}</p>
                `;
                dataList.appendChild(listItem);
            }
        });

            // Filter functionality
            document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const selectedCategories = document.querySelectorAll('.filter-checkbox:checked');
                    const selectedValues = Array.from(selectedCategories).map(cb => cb.value);

                    document.querySelectorAll('.data-item').forEach(item => {
                        const displayStyle = selectedValues.includes(item.dataset.category) ? '' : 'none';
                        item.style.display = displayStyle;
                    });
                });
            });
        });

    let zoomLevel = 1;

    let nodeData = [];

    // Zoom functionality
    document.getElementById('spiralCanvas').addEventListener('wheel', function(event) {
        event.preventDefault(); // Prevent the page from scrolling
        if (event.deltaY < 0) {
            zoomLevel *= 1.1; // Zoom in
        } else {
            zoomLevel /= 1.1; // Zoom out
        }
        displaySpiral(); // Redraw the spiral with the new zoom level
    });

    function parseCSV(text) {
        const lines = text.split('\n');
        return lines.map(line => {
            const result = [];
            let start = 0;
            let insideQuote = false;
    
            for (let i = 0; i < line.length; i++) {
                if (line[i] === '"' && (i === 0 || line[i - 1] === ',')) {
                    insideQuote = !insideQuote;
                } else if (line[i] === ',' && !insideQuote) {
                    result.push(line.substring(start, i).trim().replace(/^"|"$/g, ''));
                    start = i + 1;
                }
            }
    
            result.push(line.substring(start).trim().replace(/^"|"$/g, ''));
            return result;
        });
    }
    

    // Function to draw tooltip
    function drawTooltip(node) {
        const canvas = document.getElementById('spiralCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const tooltipWidth = 250;  // Adjust the width as needed
        const tooltipHeight = 80;  // Adjust the height as needed
        const margin = 10;  // Margin from the node to the tooltip box

        // Calculate position to avoid the tooltip going out of canvas bounds
        let tooltipX = node.x + margin;
        let tooltipY = node.y - tooltipHeight - margin;

        // Adjust position if tooltip goes beyond the canvas
        if (tooltipX + tooltipWidth > canvas.width) {
            tooltipX = canvas.width - tooltipWidth;
        }
        if (tooltipY < 0) {
            tooltipY = node.y + margin;
        }

        ctx.fillStyle = 'black';
        ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight); // Use the width and height variables here

        // Adjust text position based on the tooltip box
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(`Date: ${node.line[0]}`, tooltipX + 5, tooltipY + 20);
        ctx.fillText(`Title: ${node.line[2]}`, tooltipX + 5, tooltipY + 35);
        ctx.fillText(`Category: ${node.line[1]}`, tooltipX + 5, tooltipY + 50);
        ctx.fillText(`Description: ${node.line[3].slice(0, 30)}...`, tooltipX + 5, tooltipY + 65); // Truncate for space
    }


    // Hover functionality
    document.getElementById('spiralCanvas').addEventListener('mousemove', function(event) {
        const canvas = document.getElementById('spiralCanvas');
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const ctx = canvas.getContext('2d');

        // Flag to track if a tooltip is drawn
        let tooltipDrawn = false;

        nodeData.forEach(node => {
            const distance = Math.sqrt(Math.pow(node.x - mouseX, 2) + Math.pow(node.y - mouseY, 2));
            if (distance < 5) { // Node radius for hover detection
                drawTooltip(node); // Draw tooltip for the hovered node
                tooltipDrawn = true;
            }
        });

        // If no node is hovered, clear the previous tooltip
        if (!tooltipDrawn) {
            // This clears the potential area where tooltips can appear, can be optimized
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            displaySpiral(); // Redraw the spiral without the tooltip
        }
    });

    function displaySpiral() {
        const canvas = document.getElementById('spiralCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.style.display = 'block';
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear for redrawing

        let angle = 0;
        let baseRadiusIncrement = 2;
        let angleIncrement = 0.15;
        let indexOffset = 0; // To adjust radius based on visible nodes

        // Get the selected categories from the checkboxes
        const selectedCategories = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(cb => cb.value);

        lines.forEach((line, index) => {
            if (index > 0 && line.length > 1) {
                const category = line[1].trim();
                const effectiveCategory = categoryColors[category] ? category : 'none';

                if (selectedCategories.includes(effectiveCategory) || (effectiveCategory === 'none' && selectedCategories.includes('none'))) {
                    const radius = (index - indexOffset) * baseRadiusIncrement * zoomLevel;
                    const color = categoryColors[effectiveCategory] || "white";

                    let x = (canvas.width / 2) + radius * Math.cos(angle);
                    let y = (canvas.height / 2) + radius * Math.sin(angle);

                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fillStyle = color;
                    ctx.fill();

                    // Store node data for hover detection
                    nodeData.push({ x, y, line });

                    angle += angleIncrement;
                } else {
                    indexOffset++; // Increment indexOffset for each skipped node
                }
            }
        });
    }


    // Add event listeners to the filter checkboxes to update the spiral view on change
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Update the dataList for the list view
            const selectedValues = Array.from(document.querySelectorAll('.filter-checkbox:checked')).map(cb => cb.value);
            document.querySelectorAll('.data-item').forEach(item => {
                const displayStyle = selectedValues.includes(item.dataset.category) ? '' : 'none';
                item.style.display = displayStyle;
            });

            // Redraw the spiral with the new filters applied
            displaySpiral();
        });
    });



        
});