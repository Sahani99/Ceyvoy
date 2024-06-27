import { useState } from "react";
import "../styles/Locations.css";

function Locations() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4;
  const itemsPerPage = 4;

  const handleDetailsClick = (location) => {
    setSelectedLocation(location);
  };

  const handleCloseDetails = () => {
    setSelectedLocation(null);
  };

  const location = [
    {
      img: require("../assets/bg3.jpg"), 
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), 
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), 
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), 
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), 
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), 
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), 
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), 
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), 
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg4.jpg"),
      title: "Plush Sweater",
      description: "Sweater Season • Cozy",
      price: "29.95",
    },
    {
      img: require("../assets/bg5.jpg"),
      title: "Slim-Fit Denim",
      description: "Denim • Versatile",
      price: "24.99",
    },
    {
      img: require("../assets/bg6.jpg"),
      title: "White Blouse",
      description: "Blouse • Lacey",
      price: "19.95",
    },
    {
      img: require("../assets/bg6.jpg"),
      title: "White Blouse",
      description: "Blouse • Lacey",
      price: "19.95",
    },
  ];

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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleImages = location.slice(startIndex, endIndex);

  return (
    <div id="locations" className={selectedLocation ? "blur-background" : ""}>
      <div className="Lselector">
        <div className="wrapper">
          {visibleImages.map((item, index) => (
            <Card
              className="Lcard"
              key={index}
              img={item.img}
              title={item.title}
              description={item.description}
              price={item.price}
              onClick={() => handleDetailsClick(item)}
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
      <div className="map">
        <h1>Map</h1>
      </div>
      {selectedLocation && (
        <div className="location-details">
          <div className="location-details-content">
            <h2>{selectedLocation.title}</h2>
            <img src={selectedLocation.img} alt={selectedLocation.title} />
            <p>{selectedLocation.description}</p>
            <h3>${selectedLocation.price}</h3>
            <button onClick={handleCloseDetails}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ img, title, description, price, onClick }) {
  return (
    <div className="Lcard" onClick={onClick}>
      <div className="card__img-container">
        <img src={img} className="card__img" alt="Product" />
      </div>
      <div className="card__body">
        <h2 className="card__title">{title}</h2>
        <h3 className="card__price">{price}</h3>
      </div>
    </div>
  );
}

export default Locations;