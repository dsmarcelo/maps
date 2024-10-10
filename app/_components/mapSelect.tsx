'use client'; // Ensure this runs only on the client side

import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapSelect() {
  const [map, setMap] = useState(null);
  const [error, setError] = useState('');

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

  return (
    <div>
      <h1>Your Location on the Map</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div id="map" style={{ height: '400px', width: '100%' }}></div>
    </div>
  );
}
