import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { setupPopupHandler } from "../utils/popup";
import { setupPointerHandler } from "../utils/pointer";
import { onMapLoad as onMapLoadUtil } from "../utils/onMapLoad";

const useMapInit = (onMapLoad?: (map: maplibregl.Map) => void) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    const protocol = new Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    const map = new maplibregl.Map({
      container: mapContainerRef.current!,
      style: "styles/style.json",
      center: [139.75439, 35.68601],
      zoom: 10,
      minZoom: 4,
      hash: true,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("load", () => {
      onMapLoadUtil(map);
      onMapLoad?.(map);
    });

    setupPopupHandler(map);
    setupPointerHandler(map);

    return () => {
      map.remove();
    };
  }, [onMapLoad]);

  return { mapContainerRef, mapRef };
};

export default useMapInit;