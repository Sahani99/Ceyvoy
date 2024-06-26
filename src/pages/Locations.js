import React, { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import '../styles/Locations.css';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 7.8731, // Your desired latitude
  lng: 80.7718  // Your desired longitude
};

const markers = [
  { id: 'marker1', position: { lat: 8.3114, lng: 80.4037 }, title: 'Marker 1' },
  { id: 'marker2', position: { lat: 7.9570, lng: 80.7603 }, title: 'Marker 2' },
  { id: 'marker3', position: { lat: 6.4640, lng: 81.4719 }, title: 'Marker 3' },
  { id: 'marker3', position: { lat: 9.6615, lng: 80.0255 }, title: 'Marker 3' },
  { id: 'marker3', position: { lat: 6.9271, lng: 79.8612 }, title: 'Marker 3' },
  { id: 'marker3', position: { lat: 6.0329, lng: 80.2168 }, title: 'Marker 3' },
  // Add more markers as needed
];

function Locations() {
  const [cards] = useState([
    { title: 'card-1', text: 'text content sample' },
    { title: 'card-2', text: 'text content sample' },
    { title: 'card-3', text: 'text content sample' },
    { title: 'card-4', text: 'text content sample' },
    { title: 'card-5', text: 'text content sample' },
    { title: 'card-6', text: 'text content sample' }
  ]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCRDYBnXFSko3TWJXd4PtB0LOs1pbNpYqs", // Replace with your Google Maps API key
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div id="locations">
      <div className="location">
        <section>
          <div className="container">
            <div className="cards">
              {cards.map((card) => (
                <div className="card" key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="map">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={8}
          center={center}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              title={marker.title}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

export default Locations;
