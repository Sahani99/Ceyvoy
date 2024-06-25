import React, { useState } from 'react';
import '../styles/Event.css';
import item1 from '../assets/item1.jpg';
import item2 from '../assets/item2.jpg';
import item3 from '../assets/item3.jpg';
import item4 from '../assets/item4.jpg';
import item5 from '../assets/item5.jpg';
import item6 from '../assets/item6.jpg';
import item7 from '../assets/item7.jpg';
import item8 from '../assets/item8.jpg';
import item9 from '../assets/item9.jpg';
import item10 from '../assets/item10.jpg';

const Event = () => {
  const events = [
    {
      id: 1,
      title: 'Kandy Esala Perahera',
      date: '2024-08-05 to 2024-08-15',
      location: 'Kandy, Central Province',
      description: 'A historic procession held annually to pay homage to the Sacred Tooth Relic of Buddha. It features traditional dancers, fire-breathers, and lavishly decorated elephants.',
      type: 'Cultural Festival',
      image: item1,
    },
    {
      id: 2,
      title: 'Galle Literary Festival',
      date: '2024-01-24 to 2024-01-28',
      location: 'Galle, Southern Province',
      description: 'An international literary festival featuring writers, poets, and literary enthusiasts from around the world. The event includes book readings, discussions, and workshops.',
      type: 'Literary Festival',
      image: item2,
    },
    {
      id: 3,
      title: 'Matara Food Festival',
      date: '2024-11-15 to 2024-11-17',
      location: 'Matara, Southern Province',
      description: 'A gastronomic event featuring the best of Sri Lankan cuisine, with food stalls, cooking demonstrations, and competitions.',
      type: 'Food Festival',
      image: item3,
    },
    {
      id: 4,
      title: 'Negombo Beach Festival',
      date: '2024-04-10 to 2024-04-12',
      location: 'Negombo, Western Province',
      description: 'A lively beach festival with music, dance, water sports, and beach games. It is a great event for families and young travelers looking for fun by the sea.',
      type: 'Beach Festival',
      image: item4,
    },
    {
      id: 5,
      title: 'Ella Adventure Festival',
      date: '2024-06-05 to 2024-06-07',
      location: 'Ella, Uva Province',
      description: 'An adventure sports festival offering activities such as hiking, rock climbing, and zip-lining in the scenic hill country of Ella.',
      type: 'Adventure Festival',
      image: item5,
    },
    {
      id: 6,
      title: 'Nuwara Eliya Flower Festival',
      date: '2024-04-20 to 2024-04-30',
      location: 'Nuwara Eliya, Central Province',
      description: 'A vibrant festival showcasing beautiful floral displays, garden tours, and horticultural competitions set in the picturesque town of Nuwara Eliya.',
      type: 'Flower Festival',
      image: item6,
    },
    {
      id: 7,
      title: 'Trincomalee International Kite Festival',
      date: '2024-08-10 to 2024-08-12',
      location: 'Trincomalee, Eastern Province',
      description: 'A colorful kite festival attracting participants from around the world. It features kite flying competitions, workshops, and cultural performances.',
      type: 'Kite Festival',
      image: item7,
    },
    {
      id: 8,
      title: 'Anuradhapura Poson Festival',
      date: '2024-06-18 to 2024-06-20',
      location: 'Anuradhapura, North Central Province',
      description: 'A religious festival commemorating the introduction of Buddhism to Sri Lanka. It includes pilgrimages, processions, and the lighting of lanterns.',
      type: 'Religious Festival',
      image: item8,
    },
    {
      id: 9,
      title: 'Jaffna Music Festival',
      date: '2024-02-15 to 2024-02-17',
      location: 'Jaffna, Northern Province',
      description: 'A celebration of music featuring a diverse range of genres from traditional Tamil folk music to contemporary performances by local and international artists.',
      type: 'Music Festival',
      image: item9,
    },
    {
      id: 10,
      title: 'Colombo Fashion Week',
      date: '2024-03-20 to 2024-03-24',
      location: 'Colombo, Western Province',
      description: 'A premier fashion event showcasing the latest trends and designs from local and international designers. It includes runway shows, fashion talks, and exhibitions.',
      type: 'Fashion Show',
      image: item10,
    },
  ];

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const eventsPerPage = 3;

  const handleDetailsClick = (event) => {
    setSelectedEvent(event);
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const handleFilterLocationChange = (e) => {
    setFilterLocation(e.target.value);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const isDateInRange = (dateRange, filterDate) => {
    const [startDate, endDate] = dateRange.split(' to ').map(date => new Date(date));
    const filter = new Date(filterDate);
    return filter >= startDate && filter <= endDate;
  };

  const filteredEvents = events
    .filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(event => !filterDate || isDateInRange(event.date, filterDate))
    .filter(event => !filterLocation || event.location.includes(filterLocation))
    .filter(event => !filterType || event.type.toLowerCase() === filterType.toLowerCase());

  const startIndex = currentPage * eventsPerPage;
  const displayedEvents = filteredEvents.slice(startIndex, startIndex + eventsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, Math.floor(filteredEvents.length / eventsPerPage)));
  };

  return (
    <div className="event-page">
      <h1>Upcoming Events</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="filter-options">
        <label><b>Filter by:</b></label>
        <div>
          <label><b>
            Date:
            <input type="date" value={filterDate} onChange={handleFilterDateChange} />
          </b></label>
          <label><b>
            Location:
            <select value={filterLocation} onChange={handleFilterLocationChange}>
              <option value="">All Locations</option>
              <option value="Central Province">Central Province</option>
              <option value="Eastern Province">Eastern Province</option>
              <option value="North Central Province">North Central Province</option>
              <option value="Northern Province">Northern Province</option>
              <option value="Southern Province">Southern Province</option>
              <option value="Uva Province">Uva Province</option>
              <option value="Western Province">Western Province</option>
            </select>
          </b></label>
          <label><b>
            Event Type:
            <select value={filterType} onChange={handleFilterTypeChange}>
              <option value="">All Types</option>
              <option value="Cultural Festival">Cultural Festival</option>
              <option value="Literary Festival">Literary Festival</option>
              <option value="Food Festival">Food Festival</option>
              <option value="Beach Festival">Beach Festival</option>
              <option value="Adventure Festival">Adventure Festival</option>
              <option value="Flower Festival">Flower Festival</option>
              <option value="Kite Festival">Kite Festival</option>
              <option value="Religious Festival">Religious Festival</option>
              <option value="Music Festival">Music Festival</option>
              <option value="Fashion Show">Fashion Show</option>
            </select>
          </b></label>
        </div>
      </div>

      <div className="event-navigation">
        <div className="event-list">
          {displayedEvents.map(event => (
            <div key={event.id} className="event-item">
              <img src={event.image} alt={event.title} />
              <h2>{event.title}</h2>
              <p>{event.date}</p>
              <p>{event.location}</p>
              <p>{event.type}</p>
              <button onClick={() => handleDetailsClick(event)}>View Details</button>
            </div>
          ))}
        </div>
        <div className="navigation-buttons">
          <button className="nav-button left" onClick={handlePrevPage}>&lt;</button>
          <button className="nav-button right" onClick={handleNextPage}>&gt;</button>
        </div>
      </div>

      {selectedEvent && (
        <div className="event-details">
          <h2>{selectedEvent.title}</h2>
          <img src={selectedEvent.image} alt={selectedEvent.title} />
          <p><b>Date:</b> {selectedEvent.date}</p>
          <p><b>Location:</b> {selectedEvent.location}</p>
          <p><b>Description:</b> {selectedEvent.description}</p>
          <p><b>Type:</b> {selectedEvent.type}</p>
          <button onClick={handleCloseDetails}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Event;
