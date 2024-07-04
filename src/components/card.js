function Card({
  img,
  title,
  description,
  price,
  isSelected,
  onSelect,
  onMouseEnter,
  onMouseLeave,
  id, // Add id as a prop
}) {
  return (
    <div className="Lcard">
      <div className="card__img-container" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <img src={img} className="card__img" alt="Location" />
      </div>
      <div className="card__body">
        <h2 className="card__title">{title}</h2>
        <h3 className="card__price">${price}</h3>
        <div className="checkbox-location">
          <input type="checkbox" id={`checkbox-${id}`} checked={isSelected} onChange={() => onSelect(!isSelected)} />
          <label htmlFor={`checkbox-${id}`}></label>
        </div>
      </div>
    </div>
  );
}

export default Card;
