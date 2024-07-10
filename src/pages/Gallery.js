import React from "react";
import "uikit/dist/css/uikit.min.css";
import "uikit/dist/js/uikit.min.js";
import "../styles/Gallery.css";

const Gallery = () => {
  return (
    <div className="main-content">
      <div uk-filter="target: .js-filter">
        <ul className="uk-navbar-nav">
          <li className="uk-active" uk-filter-control="*">
            <a href="section">All</a>
          </li>
          <li uk-filter-control="[data-num='2']">
            <a href="section">Cultural Attractions</a>
          </li>
          <li uk-filter-control="[data-num='1']">
            <a href="section">Natural Attractions</a>
          </li>
          <li uk-filter-control="[data-num='3']">
            <a href="section">Other</a>
          </li>
        </ul>

        <ul
          className="img-gallery-container js-filter uk-child-width-1-2 uk-child-width-1-4@m uk-text-center"
          uk-grid="true"
        >
          <li data-num="1">
            <img
              src={require("../Images/6.jpeg")}
              alt="Attraction 1"
              className="img-gal"
            />
            <div className="float-gallery-content">
              <div className="content uk-text-left">
                <span className="highlight uk-block">
                  Tea garden | Nuwara Eliya
                </span>
              </div>
              <div className="content-btn">
                <button type="button">&#8594;</button>
              </div>
            </div>
          </li>
          <li data-num="1">
            <img
              src={require("../Images/3.jpeg")}
              alt="Attraction 2"
              className="img-gal"
            />
            <div className="float-gallery-content">
              <div className="content uk-text-left">
                <span className="highlight uk-block">Water Fall | Badulla</span>
              </div>
              <div className="content-btn">
                <button type="button">&#8594;</button>
              </div>
            </div>
          </li>
          <li data-num="1">
            <img
              src={require("../Images/7.jpeg")}
              alt="Attraction 3"
              className="img-gal"
            />
            <div className="float-gallery-content">
              <div className="content uk-text-left">
                <span className="highlight uk-block">Beach | Trincomalee</span>
              </div>
              <div className="content-btn">
                <button type="button">&#8594;</button>
              </div>
            </div>
          </li>
          <li data-num="1">
            <img
            // img 10.jpg
              src={require("../Images/11.png")}
              alt="Attraction 4"
              className="img-gal"
            />
            <div className="float-gallery-content">
              <div className="content uk-text-left">
                <span className="highlight uk-block">Mountain | Ella</span>
              </div>
              <div className="content-btn">
                <button type="button">&#8594;</button>
              </div>
            </div>
          </li>
          <li data-num="2">
            <img
              src={require("../Images/8.jpeg")}
              alt="Attraction 5"
              className="img-gal"
            />
            <div className="float-gallery-content">
              <div className="content uk-text-left">
                <span className="highlight uk-block">
                  Temple | Anuradhapura
                </span>
              </div>
              <div className="content-btn">
                <button type="button">&#8594;</button>
              </div>
            </div>
          </li>
          <li data-num="2">
            <img
              src={require("../Images/9.jpg")}
              alt="Attraction 6"
              className="img-gal"
            />
            <div className="float-gallery-content">
              <div className="content uk-text-left">
                <span className="highlight uk-block">Sigiriya | Dambulla</span>
              </div>
              <div className="content-btn">
                <button type="button">&#8594;</button>
              </div>
            </div>
          </li>
          <li data-num="2">
            <img
              src={require("../Images/11.png")}
              alt="Attraction 7"
              className="img-gal"
            />
            <div className="float-gallery-content">
              <div className="content uk-text-left">
                <span className="highlight uk-block">
                  Esala Perahera | Kandy
                </span>
              </div>
              <div className="content-btn">
                <button type="button">&#8594;</button>
              </div>
            </div>
          </li>
          <li data-num="2">
            <img
            // img 1.jpg
              src={require("../Images/3.jpeg")}
              alt="Attraction 8"
              className="img-gal"
            />
            <div className="float-gallery-content">
              <div className="content uk-text-left">
                <span className="highlight uk-block">Adam's Peak | Hatton</span>
              </div>
              <div className="content-btn">
                <button type="button">&#8594;</button>
              </div>
            </div>
          </li>
          <li data-num="3">
            <img
              src={require("../Images/13.jpg")}
              alt="Attraction 9"
              className="img-gal"
            />
            <div className="float-gallery-content">
              <div className="content uk-text-left">
                <span className="highlight uk-block">Cityscape | Colombo</span>
              </div>
              <div className="content-btn">
                <button type="button">&#8594;</button>
              </div>
            </div>
          </li>
          <li data-num="3">
            <img
              src={require("../Images/5.jpeg")}
              alt="Attraction 10"
              className="img-gal"
            />
            <div className="float-gallery-content">
              <div className="content uk-text-left">
                <span className="highlight uk-block">
                  Nine arch bridge | Badulla
                </span>
              </div>
              <div className="content-btn">
                <button type="button">&#8594;</button>
              </div>
            </div>
          </li>
          <li data-num="3">
            <img
              src={require("../Images/14.jpg")}
              alt="Attraction 11"
              className="img-gal"
            />
            <div className="float-gallery-content">
              <div className="content uk-text-left">
                <span className="highlight uk-block">
                  white-water rafting | Kitulgala
                </span>
              </div>
              <div className="content-btn">
                <button type="button">&#8594;</button>
              </div>
            </div>
          </li>
          <li data-num="3">
            <img
                        // img 12.jpg
              src={require("../Images/14.jpg")}
              alt="Attraction 12"
              className="img-gal"
            />
            <div className="float-gallery-content">
              <div className="content uk-text-left">
                <span className="highlight uk-block">Galle Fort | Galle</span>
              </div>
              <div className="content-btn">
                <button type="button">&#8594;</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Gallery;
