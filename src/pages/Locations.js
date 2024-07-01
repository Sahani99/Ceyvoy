import { useState } from "react";
import Card from "../components/card"; // Adjust import path based on your project structure
import "../styles/Locations.css";
import locations from "../components/location"; // Adjust path to match your actual file structure

function Locations() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCards, setSelectedCards] = useState([]);
  const itemsPerPage = 4; // Define itemsPerPage here

  // Calculate total pages based on the length of locations array and itemsPerPage
  const totalPages = Math.ceil(locations.length / itemsPerPage);

  const handleCardSelect = (index, isSelected) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    const updatedSelectedCards = [...selectedCards];

    if (isSelected) {
      updatedSelectedCards.push(locations[actualIndex]);
    } else {
      const cardIndex = updatedSelectedCards.findIndex(
        (card) => card === locations[actualIndex]
      );
      if (cardIndex !== -1) {
        updatedSelectedCards.splice(cardIndex, 1);
      }
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

  const handleCardHover = (index) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + index;
    setSelectedLocation(locations[actualIndex]);
  };

  const handleCardLeave = () => {
    setSelectedLocation(null);
  };

  const handleConfirm = () => {
    // Implement logic to save selectedCards to the database or handle as required
    console.log("Selected Cards:", selectedCards);
    // Reset selection state after saving to database if needed
    setSelectedCards([]);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleImages = locations.slice(startIndex, endIndex);

  return (
    <div id="locations" className={selectedLocation ? "blurred" : ""}>
      <div className="Lselector">
        <div className="wrapper">
          {visibleImages.map((item, index) => (
            <Card
              key={startIndex + index}
              img={item.img}
              title={item.title}
              description={item.description}
              price={item.price}
              isSelected={selectedCards.some((card) => card === item)}
              onSelect={(isSelected) => handleCardSelect(index, isSelected)}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={handleCardLeave}
              id={startIndex + index} // Pass a unique id to each card
            />
          ))}
        </div>
        <div className="pagination">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="pagebtn"
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="pagebtn"
          >
            Next
          </button>
        </div>
      </div>

      {selectedLocation && (
        <div className="location-details-content">
          <img src={selectedLocation.img} alt={selectedLocation.title} />
          <h2>{selectedLocation.title}</h2>
          <p>{selectedLocation.description}</p>
          <h3>${selectedLocation.price}</h3>
        </div>
      )}

      <div className="map">
      <h1>Map</h1>
      </div>

      <div className="lbtn">
        <button onClick={handleConfirm} className="confirm-btn">
          Confirm Selection
        </button>
        <div className="selected-list">
          <h3>Selected Places:</h3>
          <ul>
            {selectedCards.map((card, index) => (
              <li key={index}>{card.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Locations;
