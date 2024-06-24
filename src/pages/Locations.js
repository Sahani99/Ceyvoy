import { useState } from "react";
import "../styles/Locations.css";

function Locations() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 4; // Assuming you have 4 pages of static images
  const itemsPerPage = 4; // Number of items per page

  // Array of static images
  const images = [
    {
      //img: require("../assets/3.jpeg"), // Importing local image using require
      title: "Tie Up Boots",
      description: "Fall Favorite • Boots",
      price: "45.00",
    },
    {
      // img: "https://images.unsplash.com/photo-1581497396202-5645e76a3a8e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80",
      title: "Plush Sweater",
      description: "Sweater Season • Cozy",
      price: "29.95",
    },
    {
      // img: "https://images.unsplash.com/photo-1475178626620-a4d074967452?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=666&q=80",
      title: "Slim-Fit Denim",
      description: "Denim • Versatile",
      price: "24.99",
    },
    {
      // img: "https://images.unsplash.com/photo-1569235080412-01b4eefa5fbe?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
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
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
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
        <button className="card__btn">Add to Cart</button>
      </div>
    </div>
  );
}

export default Locations;
