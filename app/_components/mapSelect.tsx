'use client'; // Ensure this runs only on the client side

import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { latLongToAddress } from '@/lib/geoFunctions';

export default function MapSelect() {
  const [map, setMap] = useState(null);
  const [error, setError] = useState('');
  const [location, setLocation] = useState(null);
  const markerRef = useRef<L.Marker | null>(null);

  const locationIcon = L.icon({
    iconUrl: '/location.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [1, -34],
  });

  useEffect(() => {
    // Function to initialize the map
    const initMap = (lat, lng) => {
      // Create a map centered on the user's location
      const userMap = L.map('map').setView([lat, lng], 13);

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(userMap);

      // Add a marker at the user's location
      L.marker([lat, lng]).addTo(userMap)
        .bindPopup('You are here!')
        .openPopup();

      userMap.on('click', function (e: LeafletMouseEvent) {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        console.log(`Clicked coordinates: Latitude: ${lat}, Longitude: ${lng}`);
        L.marker([lat, lng], { icon: locationIcon }).addTo(userMap);
        L.popup()
          .setLatLng([lat, lng])
          .setContent(lat)
          .openOn(userMap);

        // L.marker([lat, lng]).addTo(userMap);
      });

      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add a new marker at the clicked location

      setMap(userMap);
    };

    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          initMap(latitude, longitude);
        },
        (err) => {
          setError('Error getting your location: ' + err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  async function getLocation() {
    const res = await latLongToAddress(location)
    return res
  }

  return (
    <div className='w-full h-full'>
      <h1>Your Location on the Map</h1>
      {/* <p>{getLocation()}</p> */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div id="map" style={{ height: '400px', width: '600px' }}></div>
    </div>
  );
}
