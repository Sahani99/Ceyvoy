import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Card from '../components/card.js';
import '../styles/Locations.css';
import locationsData from '../components/location'; 
import { FaTimes } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router-dom';


mapboxgl.accessToken = 'pk.eyJ1IjoiY2V5dm95IiwiYSI6ImNseW1uNTV0ZDBkemwya3Fya2hmc3p1b3QifQ.MA5PmGoZ9MUqmCcKG2nOhQ';

function Locations() {
  const [viewport, ] = useState({
    latitude: 7.8731,
    longitude: 80.7718,
    zoom: 7,
    width: '100%',
    height: '100vh',
  });

  const mapContainerRef = useRef();
  const mapRef = useRef();
  const geocoderContainerRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCards, setSelectedCards] = useState([]);
  const [distances, setDistances] = useState([]);
  const [durations, setDurations] = useState([]);
  const [popupPosition, setPopupPosition] = useState({ top: '50%', left: '50%' });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(locationsData.length / itemsPerPage);
  const navigate = useNavigate();

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [viewport.longitude, viewport.latitude],
      zoom: viewport.zoom
    });

    mapRef.current = map;

    map.on('load', () => {
      try {
        const geocoder = new MapboxGeocoder({
          accessToken: mapboxgl.accessToken,
          mapboxgl: mapboxgl,
        });

        geocoderContainerRef.current.appendChild(geocoder.onAdd(map));

        if (locationsData) {
          locationsData.forEach((location, index) => {
            if (location.latitude && location.longitude) {
              const el = document.createElement('div');
              el.className = 'marker';
              el.innerHTML = (index + 1).toString();

              new mapboxgl.Marker(el)
                .setLngLat([location.longitude, location.latitude])
                .addTo(map);
            } else {
              console.error(`Invalid location data: ${location.title}`, location);
            }
          });
        }
      } catch (error) {
        console.error('Error initializing geocoder or adding markers:', error);
      }
    });

    return () => map.remove();
  }, [viewport]);

  const handleCardSelect = (index, isSelected) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    const updatedSelectedCards = [...selectedCards];

    if (isSelected) {
      updatedSelectedCards.push({ ...locationsData[actualIndex], order: updatedSelectedCards.length + 1 });
    } else {
      const cardIndex = updatedSelectedCards.findIndex(card => card.title === locationsData[actualIndex].title);
      if (cardIndex !== -1) {
        updatedSelectedCards.splice(cardIndex, 1);
      }
      updatedSelectedCards.forEach((card, idx) => {
        card.order = idx + 1;
      });
    }

    setSelectedCards(updatedSelectedCards);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleCardHover = (index, event) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    setSelectedLocation(locationsData[actualIndex]);
    setPopupPosition({ top: `${event.clientY}px`, left: `${event.clientX}px` });
  };

  const handleCardLeave = () => {
    setSelectedLocation(null);
  };

  const handleConfirm = async () => {
    console.log("Selected Cards:", selectedCards);
    await fetchDistanceAndDuration();
  };

  const handleRemoveSelected = index => {
    const updatedSelectedCards = selectedCards.filter((_, i) => i !== index);
    updatedSelectedCards.forEach((card, idx) => {
      card.order = idx + 1;
    });
    setSelectedCards(updatedSelectedCards);
  };

  const fetchDistanceAndDuration = async () => {
    if (selectedCards.length < 2) return;

    const coordinates = selectedCards.map(card => [card.longitude, card.latitude]).join(';');
    try {
      const response = await axios.get(`https://api.mapbox.com/directions-matrix/v1/mapbox/driving/${coordinates}?access_token=${mapboxgl.accessToken}`);
      
      if (response.data && response.data.durations && response.data.distances) {
        const durationsData = response.data.durations[0].slice(1).map(duration => duration / 3600); // Convert seconds to hours
        const distancesData = response.data.distances[0].slice(1).map(distance => distance / 1000); // Convert meters to kilometers
        setDurations(durationsData);
        setDistances(distancesData);
      }
    } catch (error) {
      console.error('Error fetching distance and duration:', error);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleImages = locationsData.slice(startIndex, endIndex);

  const moveCard = (dragIndex, hoverIndex) => {
    const updatedSelectedCards = [...selectedCards];
    const draggedCard = updatedSelectedCards[dragIndex];
    updatedSelectedCards.splice(dragIndex, 1);
    updatedSelectedCards.splice(hoverIndex, 0, draggedCard);
    updatedSelectedCards.forEach((card, idx) => {
      card.order = idx + 1;
    });
    setSelectedCards(updatedSelectedCards);
  };

  const handleAddLocation = () => {
    navigate('/AddLocations.js');
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div id="locations" className={`locations-page ${selectedLocation ? 'blurred' : ''}`}>
        <div className="map-container" ref={mapContainerRef} style={{ width: '100%', height: '100vh' }}>
          <div ref={geocoderContainerRef} id="geocoder" className="geocoder-container" />
        </div>
        
        <div className="Lselector">
          <div className="wrapper">
            {visibleImages.map((item, index) => (
              <Card
                key={startIndex + index}
                img={item.img}
                title={item.title}
                description={item.description}
                price={item.price}
                isSelected={selectedCards.some(card => card.title === item.title)}
                onSelect={isSelected => handleCardSelect(index, isSelected)}
                onMouseEnter={event => handleCardHover(index, event)}
                onMouseLeave={handleCardLeave}
                id={startIndex + index}
              />
            ))}
          </div>
          <div className="L-pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="L-pagebtn"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="L-pagebtn"
            >
              Next
            </button>
          </div>
        </div>

        {selectedLocation && (
          <div className="location-details-popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
            <img src={selectedLocation.img} alt={selectedLocation.title} />
            <h2>{selectedLocation.title}</h2>
            <p>{selectedLocation.description}</p>
            <h3>${selectedLocation.price}</h3>
          </div>
        )}

        <div className="lbtn">
          
          <div className="selected-list">
            <h3>Selected Places:</h3>
            <ul>
              {selectedCards.map((card, index) => (
                <DraggableListItem
                  key={index}
                  index={index}
                  card={card}
                  moveCard={moveCard}
                  handleRemoveSelected={handleRemoveSelected}
                  distance={distances[index]}
                  duration={durations[index]}
                />
              ))}
            </ul>
          </div>
          <button onClick={handleConfirm} className="L-confirm-btn">
            Confirm Selection
          </button>
        </div>
        <div className="distance-duration-container">
          <h3>Distance and Duration:</h3>
          {selectedCards.slice(1).map((card, index) => (
              <li key={index} className="distance-duration-item">
                {selectedCards[index].title} to {card.title}: 
                {distances[index]} km, {durations[index]} hours
              </li>
    ))}

        </div>
        <button onClick={handleAddLocation} className="add-location-btn">
          Add Location
        </button>
      </div>
    </DndProvider>
  );
}

const DraggableListItem = ({ card, index, moveCard, handleRemoveSelected, distance, duration }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: 'card',
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {card.title}
      <FaTimes
        className="L-remove-icon"
        onClick={() => handleRemoveSelected(index)}
      />
      {distance && duration && (
        <p className="distance-duration-text">
          Distance: {distance.toFixed(2)} km, Duration: {duration.toFixed(2)} hours
        </p>
      )}
    </li>
  );
};

export default Locations;

