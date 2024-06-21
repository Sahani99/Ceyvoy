import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Locations.css';

function Locations() {
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;


  useEffect(() => {
    const fetchLocations = async () => {
      const response = await axios.get('http://localhost/api.php', {
        params: { page: currentPage, limit: itemsPerPage },
      });
      setLocations(response.data.locations);
      setTotalPages(response.data.totalPages);
    };

    fetchLocations();
  }, [currentPage]);

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

  return (
    <div id="locations">
      <div className="location">
        <section>
          <div className="container">
            <div className="cards">
              {locations.map((card, index) => (
                <div className="card" key={index}>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="pagination">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </section>
      </div>
      <div className="map"></div>
    </div>
  );
}

export default Locations;