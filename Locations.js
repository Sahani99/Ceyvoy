import React, { useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/Locations.css';  // Make sure to import your CSS file

function Locations() {
  const [viewport, setViewport] = useState({
    latitude: 7.8731,
    longitude: 80.7718,
    zoom: 7,
    width: '100%',
    height: '100%',
  });

  const [selectedLocation, setSelectedLocation] = useState(null);

  const locations = [
    { name: 'Colombo', latitude: 6.9271, longitude: 79.8612 },
    { name: 'Kandy', latitude: 7.2906, longitude: 80.6337 },
    { name: 'Galle', latitude: 6.0535, longitude: 80.2200 },
    { name: 'Mirissa', Latitude: 5.9485, Longitude: 80.4532 },
  ];

  const [cards] = useState([
    { title: 'card-1', text: 'text content sample' },
    { title: 'card-2', text: 'text content sample' },
    { title: 'card-3', text: 'text content sample' },
    { title: 'card-4', text: 'text content sample' },
    { title: 'card-5', text: 'text content sample' },
    { title: 'card-6', text: 'text content sample' },
  ]);

  return (
    <div className="locations-container">
      <div className="cards-container">
        <h2>Locations in Sri Lanka</h2>
        <ul>
          {locations.map((location, index) => (
            <li key={index} style={{ cursor: 'pointer' }} onClick={() => setSelectedLocation(location)}>
              {location.name}
            </li>
          ))}
        </ul>
        <div className="cards">
          {cards.map((card) => (
            <div className="card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="map-container">
        <ReactMapGL
          mapboxAccessToken='pk.eyJ1IjoiY2V5dm95IiwiYSI6ImNseHB0cDNyMzAwZTcycHNkd2M2MTJ0eTUifQ.zeLNwsY_PlXq3teMn26TNA'
          {...viewport}
          mapStyle='mapbox://styles/mapbox/streets-v11'
          onMove={evt => setViewport(evt.viewState)}
        >
          {selectedLocation && (
            <Marker
              latitude={selectedLocation.latitude}
              longitude={selectedLocation.longitude}
            >
              <div style={{ backgroundColor: 'red', borderRadius: '50%', width: '10px', height: '10px' }}></div>
            </Marker>
          )}
        </ReactMapGL>
      </div>
    </div>
  );
}

export default Locations;
