# 🚆 Passenger Traffic Map - AI Coding Instructions

## Project Overview
This is a React + TypeScript map application displaying Japanese railway lines and station passenger data using MapLibre GL JS with PMTiles vector tiles. Despite the repo name being "convenience-store-map", this project visualizes railway infrastructure and passenger traffic.

## Core Architecture Patterns

### Map Initialization & PMTiles Protocol
- **PMTiles Protocol Registration**: Always register PMTiles protocol before creating map instance in `useMapInit.ts`:
  ```ts
  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  ```
- **Map Style**: Uses `"styles/style.json"` from public directory with PMTiles data sources
- **Default Center**: Tokyo coordinates `[139.75439, 35.68601]` with zoom level 10

### Layer Architecture (Critical for Understanding)
The map uses a multi-layer approach for railway visualization:
1. **Prefecture layers**: `prefectures` (fill) + `prefectures_border` (dashed line)
2. **Railway lines**: Separated by institution type with dual-layer rendering
   - `rail_road_other`: Standard railways (gray)
   - `rail_road_jr_base` + `rail_road_jr_dash`: JR lines (black base + white dashes)
   - `rail_road_shinkansen_base` + `rail_road_shinkansen_dash`: Shinkansen (blue base + white dashes)
3. **Stations**: `station_passengers_circles` (circle size based on passenger count) + `station_passengers_labels`
4. **Text labels**: `rail_road_labels` (line-following text)

### Event Handler Pattern
**CRITICAL**: All interactive layers must be synchronized across three files:
- `src/utils/popup.ts`: Defines `ALLOW_LAYERS` for click events
- `src/utils/pointer.ts`: Same `ALLOW_LAYERS` for cursor changes
- `public/styles/style.json`: Layer definitions

Example layer synchronization:
```ts
const ALLOW_LAYERS = [
  "rail_road_other", 
  "rail_road_jr_base", "rail_road_jr_dash",
  "rail_road_shinkansen_base", "rail_road_shinkansen_dash",
  "station_passengers_circles"
];
```

### Data Property Conventions
- **Railway data**: `institution_type_cd` determines line type ("1"=Shinkansen, "2"=JR, other=private)
- **Station data**: `passengers` property for circle sizing, `name` for labels
- **Popup rendering**: Layer-specific content in `popup.ts` using `buildRailRoadPopup()` vs `buildStationPopup()`

## Development Workflow

### Key Commands
```bash
npm run dev          # Vite development server on :5173
npm run build        # TypeScript + Vite build
npm run deploy       # Build + deploy to GitHub Pages
```

### File Structure Impact
- `public/styles/style.json`: MapLibre style definition with PMTiles sources
- `public/data/*.pmtiles`: Vector tile data files
- `public/font/`: Noto Sans font ranges for Japanese text
- `src/utils/onMapLoad.ts`: Image loading for map symbols

### Style.json Filter Patterns
Use MapLibre expression syntax for layer filtering:
```json
"filter": ["==", ["get", "institution_type_cd"], "2"]
"filter": ["all", ["!=", ["get", "institution_type_cd"], "2"], ["!=", ["get", "institution_type_cd"], "1"]]
```

## Common Modifications

### Adding New Interactive Layers
1. Add layer definition to `public/styles/style.json`
2. Update `ALLOW_LAYERS` in both `popup.ts` and `pointer.ts`
3. Add layer-specific popup logic in `buildPopupContent()`

### Styling Railway Lines
- Use dual-layer approach: base layer (solid color) + dash layer (white dashes)
- Set `line-dasharray` property for dashed effects
- Layer order matters: base layers before dash layers

### Data-Driven Styling
Use MapLibre expressions for dynamic properties:
```json
"circle-radius": [
  "interpolate", ["linear"], ["get", "passengers"],
  0, 2, 100000, 15, 1000000, 35
]
```