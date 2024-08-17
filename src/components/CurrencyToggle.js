import React, { useState } from 'react';
import CurrencyConverter from '../pages/CurrencyConverter';
import './CurrencyToggle.css'; // Import the CSS for the toggle button

const CurrencyToggle = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="currency-toggle">
      <button onClick={toggleVisibility} className="currency-toggle-button">
        Currency Converter
      </button>
      {isVisible && (
        <div className="currency-converter-popup">
          <button onClick={toggleVisibility} className="close-button">
            &times;
          </button>
          <CurrencyConverter />
        </div>
      )}
    </div>
  );
};

export default CurrencyToggle;
