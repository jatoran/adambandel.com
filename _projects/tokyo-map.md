---
title: Tokyo Map
summary: Interactive Tokyo transit map with metro stations, rail lines, and curated points of interest
started: 2024-11-04
updated: 2024-11-22
type: web-app
stack:
  - Python
  - Folium
  - GeoPandas
  - OSMnx
  - Leaflet.js
tags:
  - geospatial
  - travel
  - data-visualization
loc: 1469
files: 7
---

## Overview

Tokyo Map is an interactive web-based map application that visualizes Tokyo's complex transit network alongside curated points of interest. It generates a self-contained HTML file featuring metro stations, rail lines with color-coded routes, and 80+ Tokyo attractions with descriptions, photos, and nearest station information.

The application fetches real geographic data from OpenStreetMap, geocodes addresses, pulls Wikipedia descriptions, and renders everything into a feature-rich Leaflet.js map with responsive design for both desktop and mobile use.

## Screenshots

<!-- SCREENSHOT: Main map view showing Tokyo with colored metro lines, station markers, and the address sidebar on the left -->
![Main Map View](/images/projects/tokyo-map/screenshot-1.png)

<!-- SCREENSHOT: Address popup showing location details, photos, Wikipedia description, and nearest metro stations with distances -->
![Address Popup](/images/projects/tokyo-map/screenshot-2.png)

<!-- SCREENSHOT: Mobile view with hamburger menu and responsive layout showing the emergency info panel -->
![Mobile View](/images/projects/tokyo-map/screenshot-3.png)

## Problem

Navigating Tokyo as a visitor is challenging due to the city's sprawling metro network with 13+ lines and hundreds of stations. Existing maps either focus purely on transit or purely on attractions, rarely connecting the two. Travelers need to know not just where something is, but how to get there via public transit.

This project was built to create a personal travel companion that combines curated destinations with practical transit information, showing the 3 nearest metro stations to any point of interest.

## Approach

The solution pulls live data from OpenStreetMap and Wikipedia to build a comprehensive, self-updating map.

### Stack

- **Folium + Leaflet.js** - Generates interactive maps from Python with full JavaScript interactivity, no backend server required
- **OSMnx** - Queries OpenStreetMap's Overpass API for transit infrastructure (stations, rail lines, ward boundaries)
- **GeoPandas** - Handles geospatial data manipulation, coordinate transformations, and spatial queries
- **Geopy/Nominatim** - Geocodes street addresses to coordinates with rate limiting and caching
- **SciPy KDTree** - Enables fast nearest-neighbor queries to find closest metro stations to each address
- **Branca** - Creates color-coded line visualizations for distinct metro routes

### Challenges

- **Rate limiting and caching** - OpenStreetMap and Nominatim have request limits. Implemented file-based caching (CSV/GeoJSON) for all API responses to enable rapid iteration without re-fetching data
- **Japanese character handling** - Station and line names exist in Japanese, English, or mixed formats. Built a translation mapping system (`line_name_mapping.json`) to normalize display names
- **Mobile responsiveness** - Folium generates desktop-first maps. Added custom CSS media queries and a collapsible sidebar with touch-friendly controls for mobile viewing
- **Image association** - Matching downloaded photos to locations required parsing filenames with regex patterns and fuzzy matching against address names

## Outcomes

The map successfully renders 100+ metro stations across all major Tokyo lines with accurate coloring, plus 80+ points of interest ranging from teamLab exhibitions to hidden yokocho alleys. Each destination shows:

- Wikipedia-sourced descriptions
- Up to 3 photos (when available)
- The 3 nearest metro stations with line names and walking distances

The output is a single, portable HTML file (~2MB) that works offline once loaded, making it ideal for travel where internet access may be limited.

## Implementation Notes

The core spatial query uses SciPy's KDTree for O(log n) nearest-neighbor lookups:

```python
from scipy.spatial import KDTree
from geopy.distance import geodesic

# Build spatial index from metro station coordinates
metro_coords = list(zip(metros_df['latitude'], metros_df['longitude']))
metro_tree = KDTree(metro_coords)

# Query 3 nearest stations for each address
distances, indices = metro_tree.query([lat, lon], k=3)
for idx in indices:
    station = metros_df.iloc[idx]
    distance_km = geodesic((lat, lon), (station['latitude'], station['longitude'])).kilometers
```

The map supports multiple tile layers (Stamen Toner, CartoDB Positron, OpenStreetMap) via Folium's layer control:

```python
folium.TileLayer('CartoDB Positron', name='Light Mode').add_to(tokyo_map)
folium.TileLayer('Stamen Toner', name='High Contrast').add_to(tokyo_map)
folium.LayerControl(collapsed=True).add_to(tokyo_map)
```

Rail lines are color-coded using Branca's colormap, with each line assigned a distinct color from the Set1 palette:

```python
import branca.colormap as cm

unique_lines = rail_lines_gdf['line_en'].unique()
color_palette = cm.linear.Set1_09.scale(0, len(unique_lines)).to_step(len(unique_lines))
line_colors = {line: color_palette(i) for i, line in enumerate(unique_lines)}
```
