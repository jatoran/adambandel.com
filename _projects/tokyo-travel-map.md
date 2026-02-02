---
title: Tokyo Interactive Travel Map
summary: Python-powered interactive map of Tokyo with metro stations, rail lines, and curated travel destinations
date: 2024-11-04
---

## Overview

Tokyo Interactive Travel Map is a Python application that generates a fully interactive HTML map of Tokyo, combining OpenStreetMap transit data with curated points of interest. The tool fetches real-time metro station data, rail line geometries, and ward boundaries, then overlays custom travel destinations with Wikipedia descriptions, nearest station calculations, and image galleries.

Built for planning a trip to Tokyo, this project transforms a list of addresses into an explorable map complete with transit routing context, making it easy to understand how locations relate to the metro network.

## Screenshots

<!-- SCREENSHOT: Interactive map view showing Tokyo with colored metro lines, station markers, and the address sidebar visible on the left -->
![Tokyo Map Overview](/images/projects/tokyo-map/screenshot-1.png)

<!-- SCREENSHOT: Popup detail view showing a location with its Wikipedia description and three nearest metro stations with distances -->
![Location Popup with Metro Distances](/images/projects/tokyo-map/screenshot-2.png)

<!-- SCREENSHOT: Mobile-responsive view showing the collapsible sidebar and touch-friendly controls -->
![Mobile Responsive View](/images/projects/tokyo-map/screenshot-3.png)

## Problem

Planning travel in Tokyo requires understanding the relationship between destinations and the complex metro/rail network. Most mapping tools don't combine transit infrastructure visualization with custom point-of-interest management, and manually looking up "nearest station" for dozens of locations is tedious.

This project automates the entire workflow: geocode addresses, fetch transit data, calculate nearest stations, pull Wikipedia summaries, and generate a shareable HTML map that works offline.

## Approach

The application follows a data pipeline architecture: fetch, transform, enrich, and render.

### Stack

- **Geospatial Processing** - OSMnx and GeoPandas for fetching OpenStreetMap data (metro stations, rail lines, ward boundaries) with spatial filtering
- **Map Rendering** - Folium wrapping Leaflet.js to generate interactive HTML maps with multiple tile layers and custom controls
- **Geocoding** - GeoPy with Nominatim for address-to-coordinate conversion with caching to avoid API rate limits
- **Spatial Queries** - SciPy KDTree for O(log n) nearest-neighbor station lookups
- **Content Enrichment** - Wikipedia API for automatic location descriptions

### Challenges

- **Japanese Line Name Translation** - Created a JSON mapping file to translate station line names (e.g., "東京メトロ丸ノ内線" to "Tokyo Metro Marunouchi Line") since OSM data mixes Japanese and romanized names inconsistently
- **Efficient Spatial Queries** - Used KDTree for finding the 3 nearest metro stations to each address instead of brute-force distance calculations, reducing complexity from O(n*m) to O(n*log m)
- **Data Caching Strategy** - Implemented CSV/GeoJSON caching for all API-fetched data (geocoded addresses, metro stations, rail lines) to enable rapid iteration without hitting rate limits
- **Mobile Responsiveness** - Added responsive CSS and a collapsible sidebar with touch-friendly controls to make the generated HTML map usable on phones during actual travel

## Outcomes

The generated `tokyo_metro_map.html` is a self-contained interactive map that works in any browser, including offline viewing once loaded. Key features include:

- Color-coded rail lines with per-line layer toggles
- Station popups with optional entrance photos
- Address markers showing Wikipedia descriptions and 3 nearest stations with distances
- Distance measurement tool for planning walking routes
- Geolocation button for real-time positioning
- Emergency contacts and Japanese language quick reference panels
- Multiple tile layer options (OpenStreetMap, Stamen Toner, CartoDB Positron)

The modular Python architecture makes it easy to adapt for other cities by changing the boundary polygon and address list.

## Implementation Notes

The nearest station calculation uses SciPy's KDTree for efficient spatial queries:

```python
from scipy.spatial import KDTree
from geopy.distance import geodesic

metro_coords = list(zip(metros_df['latitude'], metros_df['longitude']))
metro_tree = KDTree(metro_coords)

def find_nearest(row):
    distances, indices = metro_tree.query(
        [row['latitude'], row['longitude']], 
        k=3
    )
    # Convert tree distances to geodesic km
    for i, idx in enumerate(indices):
        nearest_metros[f'nearest_metro_{i+1}_distance_km'] = geodesic(
            (row['latitude'], row['longitude']),
            (metros_df.iloc[idx]['latitude'], metros_df.iloc[idx]['longitude'])
        ).kilometers
    return pd.Series(nearest_metros)
```

The map generation uses Folium's FeatureGroup system to create toggleable layers for each rail line:

```python
rail_line_groups = {}
for _, row in rail_lines_gdf.iterrows():
    line_name = row['line_en']
    color = line_color_map.get(line_name, 'gray')
    
    if line_name not in rail_line_groups:
        rail_line_groups[line_name] = folium.FeatureGroup(
            name=line_name, 
            show=True
        )
    
    folium.GeoJson(
        row['geometry'],
        style_function=lambda x, color=color: {
            'color': color, 
            'weight': 3
        },
    ).add_to(rail_line_groups[line_name])
```

Custom JavaScript handles the responsive sidebar toggle and marker highlighting on hover, injected via Jinja2 templating through Folium's MacroElement extension.
