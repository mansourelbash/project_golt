'use client';

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";


interface MapboxLocationPickerProps {
  onLocationSelect?: (location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: [number, number];
  }) => void;
  defaultLocation?: [number, number];
}

export function MapboxLocationPicker({
  onLocationSelect,
  defaultLocation = [-74.006, 40.7128], // Default to NYC
}: MapboxLocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the map
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: defaultLocation,
      zoom: 13,
    });

    // Add navigation control
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Initialize marker
    marker.current = new mapboxgl.Marker({
      draggable: true,
    })
      .setLngLat(defaultLocation)
      .addTo(map.current);

    // Add geocoder
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
    });

    map.current.addControl(geocoder);

    // Handle geocoder result
    geocoder.on("result", (event) => {
      const { result } = event;
      if (!result) return;

      // Update marker position
      const coordinates: [number, number] = [
        result.center[0],
        result.center[1],
      ];
      marker.current?.setLngLat(coordinates);

      // Extract address components
      const address = result.place_name;
      let city = "", state = "", zipCode = "";

      result.context?.forEach((context: any) => {
        if (context.id.startsWith("place")) {
          city = context.text;
        } else if (context.id.startsWith("region")) {
          state = context.text;
        } else if (context.id.startsWith("postcode")) {
          zipCode = context.text;
        }
      });

      // Notify parent component
      onLocationSelect?.({
        address,
        city,
        state,
        zipCode,
        coordinates,
      });
    });

    // Handle marker dragend
    marker.current.on("dragend", async () => {
      const coordinates = marker.current?.getLngLat();
      if (!coordinates) return;

      try {
        // Reverse geocode the coordinates
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates.lng},${coordinates.lat}.json?access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        
        if (data.features?.length > 0) {
          const feature = data.features[0];
          const address = feature.place_name;
          let city = "", state = "", zipCode = "";

          feature.context?.forEach((context: any) => {
            if (context.id.startsWith("place")) {
              city = context.text;
            } else if (context.id.startsWith("region")) {
              state = context.text;
            } else if (context.id.startsWith("postcode")) {
              zipCode = context.text;
            }
          });

          onLocationSelect?.({
            address,
            city,
            state,
            zipCode,
            coordinates: [coordinates.lng, coordinates.lat],
          });
        }
      } catch (error) {
        console.error("Error reverse geocoding:", error);
      }
    });

    return () => {
      map.current?.remove();
    };
  }, [defaultLocation, onLocationSelect]);

  const handleLocationSelect = (location: any) => {
    console.log('Location selected:', location);
    onLocationSelect?.(location);
  };

  return (
    <div 
      ref={mapContainer} 
      className="w-full aspect-video bg-muted rounded-md"
    />
  );
}
