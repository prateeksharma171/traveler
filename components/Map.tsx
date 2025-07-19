import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface Location {
  lat: number;
  lng: number;
  city: string;
  country: string;
}

interface MapProps {
  itineraries: Location[];
}

const Map = ({ itineraries }: MapProps) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://api.maptiler.com/maps/satellite/style.json?key=${process.env.NEXT_PUBLIC_MAP_TILER_KEY}`,
      center:
        itineraries.length > 0
          ? [itineraries[0].lng, itineraries[0].lat]
          : [0, 0],
      zoom: 1,
    });

    // Add markers for each itinerary
    itineraries.forEach((loc) => {
      new maplibregl.Marker().setLngLat([loc.lng, loc.lat]).addTo(map);
    });

    return () => map.remove(); // Cleanup on unmount
  }, [itineraries]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: '500px', borderRadius: '8px' }}
    />
  );
};

export default Map;
