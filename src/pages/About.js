import React from 'react';
import '../styles/Aboutstyle.css'; 

function About() {
  return (
    <div className="section">
      <div className="container">
        <h1>About Us</h1>
        <div className="content-section">
          <h3>Welcome to CeyVoy</h3>
          <p>
            Your ultimate travel companion for exploring the wonders of Sri Lanka.
            Our mission is to enhance your travel experience by offering personalized travel packages and 
            tailored recommendations that align with your interests, budget, and travel goals.
            At CeyVoy, we understand that every traveler is unique, 
            which is why we provide custom itineraries designed just for you. Our user-friendly platform allows you to easily plan your trips, discover new destinations, 
            and access valuable insights and updates to make your journey memorable. Whether you're a traveler, tour guide, or accommodation provider, 
            CeyVoy is here to ensure that your travel plans are seamless, enjoyable, and unforgettable.
            Join us on this journey and discover the beauty of Sri Lanka with personalized precision and care.
          </p>
          <div className="button">
            <a href="#">Read More</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;






