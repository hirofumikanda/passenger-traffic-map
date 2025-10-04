import { Map, MapMouseEvent } from "maplibre-gl";

const ALLOW_LAYERS = ["rail_road_other", "rail_road_jr_base", "rail_road_jr_dash", "rail_road_shinkansen_base", "rail_road_shinkansen_dash", "station_passengers_circles"];

export const setupPointerHandler = (map: Map) => {
  map.on("mousemove", (e: MapMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ALLOW_LAYERS,
    });
    if (features.length > 0) {
      map.getCanvas().style.cursor = "pointer";
    } else {
      map.getCanvas().style.cursor = "";
    }
  });
};
