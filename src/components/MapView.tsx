import useMapInit from "../hooks/useMapInit";

const MapView = () => {
  const { mapContainerRef } = useMapInit();

  return (
    <>
      <div ref={mapContainerRef} style={{ width: "100%", height: "100vh" }} />
    </>
  );
};

export default MapView;
