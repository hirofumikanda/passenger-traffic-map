import maplibregl, { Map, MapMouseEvent } from "maplibre-gl";
import type { MapGeoJSONFeature } from "maplibre-gl";

const ALLOW_LAYERS = ["rail_road_other", "rail_road_jr_base", "rail_road_jr_dash", "rail_road_shinkansen_base", "rail_road_shinkansen_dash", "station_passengers_circles"];

export const setupPopupHandler = (map: Map) => {
  map.on("click", (e: MapMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ALLOW_LAYERS,
    });

    if (features.length === 0) return;

    const popupContent = buildPopupContent(features[0]);
    new maplibregl.Popup({ closeOnClick: true })
      .setLngLat(e.lngLat)
      .setHTML(popupContent)
      .addTo(map);
  });
};

const buildPopupContent = (feature: MapGeoJSONFeature): string => {
  const props = feature.properties ?? {};
  const layerId = feature.layer.id;
  
  if (layerId === "rail_road_other" || layerId === "rail_road_jr_base" || layerId === "rail_road_jr_dash" || layerId === "rail_road_shinkansen_base" || layerId === "rail_road_shinkansen_dash") {
    return buildRailRoadPopup(props);
  } else if (layerId === "station_passengers_circles") {
    return buildStationPopup(props);
  }
  
  // デフォルトの表示（その他のレイヤー用）
  return buildDefaultPopup(props);
};

const buildRailRoadPopup = (props: Record<string, any>): string => {
  const name = props.name || "不明な路線";
  return `
    <table style="border-collapse:collapse;">
      <tr>
        <td style="padding:4px; border:1px solid #ccc;"><strong>路線名</strong></td>
        <td style="padding:4px; border:1px solid #ccc;">${escapeHTML(name)}</td>
      </tr>
    </table>
  `;
};

const buildStationPopup = (props: Record<string, any>): string => {
  const name = props.name || "不明な駅";
  const passengers = props.passengers || 0;
  const formattedPassengers = Number(passengers).toLocaleString();
  
  return `
    <table style="border-collapse:collapse;">
      <tr>
        <td style="padding:4px; border:1px solid #ccc;"><strong>駅名</strong></td>
        <td style="padding:4px; border:1px solid #ccc;">${escapeHTML(name)}</td>
      </tr>
      <tr>
        <td style="padding:4px; border:1px solid #ccc;"><strong>乗降客数</strong></td>
        <td style="padding:4px; border:1px solid #ccc;">${formattedPassengers}人/日</td>
      </tr>
    </table>
  `;
};

const buildDefaultPopup = (props: Record<string, any>): string => {
  let html = `<table style="border-collapse:collapse;">`;

  for (const key in props) {
    let label = key;
    let value = props[key];
    if (Object.prototype.hasOwnProperty.call(props, key)) {
      html += `
        <tr>
          <td style="padding:4px; border:1px solid #ccc;"><strong>${escapeHTML(
            label
          )}</strong></td>
          <td style="padding:4px; border:1px solid #ccc;">${escapeHTML(
            String(value)
          )}</td>
        </tr>`;
    }
  }

  html += `</table>`;
  return html;
};

const escapeHTML = (str: string): string =>
  str.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char];
  });
