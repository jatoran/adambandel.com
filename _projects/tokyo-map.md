---
title: Tokyo Map
summary: An interactive Tokyo map of the places I wanted to visit on a trip and the nearest train stations to each, saved as one HTML file
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

Tokyo Map is a Python program that builds an interactive map of Tokyo as a single HTML file.
It shows the metro stations and rail lines, each line in its own color, and the places I wanted to visit, from teamLab exhibitions to yokocho alleys.
Each place's popup lists its three nearest stations and, where available, a description and photos.

It pulls station, line and ward data from OpenStreetMap, geocodes the addresses, fetches descriptions from Wikipedia, and renders it all as a Leaflet.js map laid out for a phone as well as a desktop.

## Screenshots

<!-- SCREENSHOT: Main map view showing Tokyo with colored metro lines, station markers, and the address sidebar on the left -->
![Main Map View](/images/projects/tokyo-map/screenshot-1.png)

<!-- SCREENSHOT: Address popup showing location details, photos, Wikipedia description, and nearest metro stations with distances -->
![Address Popup](/images/projects/tokyo-map/screenshot-2.png)

<!-- SCREENSHOT: Mobile view with hamburger menu and responsive layout showing the emergency info panel -->
![Mobile View](/images/projects/tokyo-map/screenshot-3.png)

## Problem

I had been to Tokyo once before and was planning a second trip, and I thought it would be nice to have an interactive map to go around with me.
It would show the places I wanted to visit, so I could see them clustered around the areas I was going to, and it would all be saved locally as a single HTML file on my phone.
Each pin would have its own details, images and links.

Tokyo's metro network has 13+ lines and hundreds of stations, so the map also shows the three nearest stations to every place.

## Approach

All the data is fetched when the map is built and cached to files, so the HTML is a snapshot, not a live map.

### Stack

- Folium and Leaflet.js: interactive maps generated from Python, with no backend server
- OSMnx to query OpenStreetMap's Overpass API for stations, rail lines and ward boundaries
- GeoPandas for the geospatial data, coordinate transformations and spatial queries
- Geopy with Nominatim to geocode street addresses, rate-limited and cached
- SciPy's KDTree for nearest-neighbor queries, to find the closest stations to each address
- Branca to give each line its own color

### Challenges

- OpenStreetMap and Nominatim limit requests. Every API response is cached to a file (CSV or GeoJSON), so the map can be rebuilt quickly without fetching the data again.
- Station and line names come in Japanese, English or a mix. A mapping file, `line_name_mapping.json`, normalizes the display names.
- Folium maps are built for the desktop first. Custom CSS media queries and a collapsible sidebar with touch-friendly controls make it usable on a phone.
- Matching the downloaded photos to places meant parsing filenames with regex and fuzzy-matching them against the address names.

## Outcomes

The finished map has more than 800 stations and 69 places.
Each place shows:

- a Wikipedia description, when the lookup found one, which was about a third of the time
- up to 3 photos, when there are any
- its 3 nearest stations, with line names and straight-line distances

The output is one HTML file of about 16 MB.
The pins and their details are in the file itself, but the map tiles and the Leaflet scripts load from the internet, and the photos are linked from the disk of the PC that built it, so they don't show anywhere else.

It was a nice little tool, and it was cool to have it all visualized like that, but I didn't end up using it.
I only started it a couple of days before I left, so I didn't have time to really polish it.

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
