import React from 'react';
import '../components/card.css';

function Card({
  img,
  title,
  description,
  price,
  isSelected,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  id
}) {
  return (
    <div
      className="Lcard"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="card__img-container">
        <img src={img} alt={title} className="card__img" />
      </div>
      <div className="card__body">
        <h2 className="card__title">{title}</h2>
        <p className="card__description">{description}</p>
        
        <div className="card__footer">
          <span className="card__price">${price}</span>
          <div className="toggle-container">
            <input
              type="checkbox"
              id={`toggle-${id}`}
              className="toggle-input"
              checked={isSelected}
              onChange={() => onSelect(!isSelected)}
            />
            <label htmlFor={`toggle-${id}`} className="toggle-label"></label>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Card;
