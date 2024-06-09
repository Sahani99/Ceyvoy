import { useState } from 'react';
import '../styles/Locations.css';


    function Locations() {
      const [cards] = useState([
        {title: 'card-1', text: 'text content sample'},
        {title: 'card-2', text: 'text content sample'},
        {title: 'card-3', text: 'text content sample'},
        {title: 'card-4', text: 'text content sample'},
        {title: 'card-5', text: 'text content sample'},
        {title: 'card-6', text: 'text content sample'}
        // ... other cards
      ]);

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
  
        <div className="map"></div>
      </div>
    );
  }
  
  export default Locations;