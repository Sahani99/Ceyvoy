import { useState } from "react";
import "../styles/Locations.css";

function Locations() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4; // Assuming you have 4 pages of static images
  const itemsPerPage = 4; // Number of items per page

  // Array of static images
  const images = [
    {
      img: require("../assets/bg3.jpg"), // Importing local image using require
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), // Importing local image using require
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), // Importing local image using require
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), // Importing local image using require
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), // Importing local image using require
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), // Importing local image using require
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), // Importing local image using require
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), // Importing local image using require
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      img: require("../assets/bg3.jpg"), // Importing local image using require
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

  // Calculate start and end index for pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the images array based on currentPage and itemsPerPage
  const visibleImages = images.slice(startIndex, endIndex);

  return (

    <div id="locations">
      <div className="Lselector">
      <div className="wrapper">
        {visibleImages.map((item, index) => (
          <Card
            key={index}
            img={item.img}
            title={item.title}
            description={item.description}
            price={item.price}
          />
        ))}
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagebtn">
          Previous
        </button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagebtn">
          Next
        </button>
      </div>
      </div>
      <div className="map">
        <h1>Map</h1>
      </div>
    </div>
  );
}

function Card({ img, title, description, price }) {
  return (
    <div className="card">
      <img src={img} className="card__img" alt="Product" />
      <div className="card__body">
        <h2 className="card__title">{title}</h2>
        <p className="card__description">{description}</p>
        <h3 className="card__price">{price}</h3>
        {/* <button className="card__btn">Add to Cart</button> */}
      </div>
    </div>
  );
}

export default Locations;
