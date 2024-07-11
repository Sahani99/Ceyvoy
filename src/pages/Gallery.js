import React from "react";
import "uikit/dist/css/uikit.min.css";
import "uikit/dist/js/uikit.min.js";
import "../styles/Gallery.css";

const Gallery = () => {
  return (
    <div className="gallery-main-content">
      <div uk-filter="target: .js-filter">
        <ul className="gallery-navbar-nav uk-navbar-nav">
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
          className="gallery-img-gallery-container js-filter uk-child-width-1-2 uk-child-width-1-4@m uk-text-center"
          uk-grid="true"
        >
          <li data-num="1">
            <img
              src={require("../assets/gal6.jpeg")}
              alt="Attraction 1"
              className="gallery-img-gal"
            />
            <div className="gallery-float-gallery-content">
              <div className="gallery-content uk-text-left">
                <span className="gallery-highlight uk-block">
                  Tea garden | Nuwara Eliya
                </span>
              </div>
              <div className="content-btn">
                <button type="button" className="gallery-button">
                  &#8594;
                </button>
              </div>
            </div>
          </li>
          <li data-num="1">
            <img
              src={require("../assets/gal3.jpeg")}
              alt="Attraction 2"
              className="gallery-img-gal"
            />
            <div className="gallery-float-gallery-content">
              <div className="gallery-content uk-text-left">
                <span className="gallery-highlight uk-block">
                  Water Fall | Badulla
                </span>
              </div>
              <div className="content-btn">
                <button type="button" className="gallery-button">
                  &#8594;
                </button>
              </div>
            </div>
          </li>
          <li data-num="1">
            <img
              src={require("../assets/gal7.jpeg")}
              alt="Attraction 3"
              className="gallery-img-gal"
            />
            <div className="gallery-float-gallery-content">
              <div className="gallery-content uk-text-left">
                <span className="gallery-highlight uk-block">
                  Beach | Trincomalee
                </span>
              </div>
              <div className="content-btn">
                <button type="button" className="gallery-button">
                  &#8594;
                </button>
              </div>
            </div>
          </li>
          <li data-num="1">
            <img
              src={require("../assets/gal10.jpg")}
              alt="Attraction 4"
              className="gallery-img-gal"
            />
            <div className="gallery-float-gallery-content">
              <div className="gallery-content uk-text-left">
                <span className="gallery-highlight uk-block">
                  Mountain | Ella
                </span>
              </div>
              <div className="content-btn">
                <button type="button" className="gallery-button">
                  &#8594;
                </button>
              </div>
            </div>
          </li>
          <li data-num="2">
            <img
              src={require("../assets/gal8.jpeg")}
              alt="Attraction 5"
              className="gallery-img-gal"
            />
            <div className="gallery-float-gallery-content">
              <div className="gallery-content uk-text-left">
                <span className="gallery-highlight uk-block">
                  Temple | Anuradhapura
                </span>
              </div>
              <div className="content-btn">
                <button type="button" className="gallery-button">
                  &#8594;
                </button>
              </div>
            </div>
          </li>
          <li data-num="2">
            <img
              src={require("../assets/gal9.jpg")}
              alt="Attraction 6"
              className="gallery-img-gal"
            />
            <div className="gallery-float-gallery-content">
              <div className="gallery-content uk-text-left">
                <span className="gallery-highlight uk-block">
                  Sigiriya | Dambulla
                </span>
              </div>
              <div className="content-btn">
                <button type="button" className="gallery-button">
                  &#8594;
                </button>
              </div>
            </div>
          </li>
          <li data-num="2">
            <img
              src={require("../assets/gal11.png")}
              alt="Attraction 7"
              className="gallery-img-gal"
            />
            <div className="gallery-float-gallery-content">
              <div className="gallery-content uk-text-left">
                <span className="gallery-highlight uk-block">
                  Esala Perahera | Kandy
                </span>
              </div>
              <div className="content-btn">
                <button type="button" className="gallery-button">
                  &#8594;
                </button>
              </div>
            </div>
          </li>
          <li data-num="2">
            <img
              src={require("../assets/gal1.jpg")}
              alt="Attraction 8"
              className="gallery-img-gal"
            />
            <div className="gallery-float-gallery-content">
              <div className="gallery-content uk-text-left">
                <span className="gallery-highlight uk-block">
                  Adam's Peak | Hatton
                </span>
              </div>
              <div className="content-btn">
                <button type="button" className="gallery-button">
                  &#8594;
                </button>
              </div>
            </div>
          </li>
          <li data-num="3">
            <img
              src={require("../assets/gal13.jpg")}
              alt="Attraction 9"
              className="gallery-img-gal"
            />
            <div className="gallery-float-gallery-content">
              <div className="gallery-content uk-text-left">
                <span className="gallery-highlight uk-block">
                  Cityscape | Colombo
                </span>
              </div>
              <div className="content-btn">
                <button type="button" className="gallery-button">
                  &#8594;
                </button>
              </div>
            </div>
          </li>
          <li data-num="3">
            <img
              src={require("../assets/gal5.jpeg")}
              alt="Attraction 10"
              className="gallery-img-gal"
            />
            <div className="gallery-float-gallery-content">
              <div className="gallery-content uk-text-left">
                <span className="gallery-highlight uk-block">
                  Nine arch bridge | Badulla
                </span>
              </div>
              <div className="content-btn">
                <button type="button" className="gallery-button">
                  &#8594;
                </button>
              </div>
            </div>
          </li>
          <li data-num="3">
            <img
              src={require("../assets/gal14.jpg")}
              alt="Attraction 11"
              className="gallery-img-gal"
            />
            <div className="gallery-float-gallery-content">
              <div className="gallery-content uk-text-left">
                <span className="gallery-highlight uk-block">
                  white-water rafting | Kitulgala
                </span>
              </div>
              <div className="content-btn">
                <button type="button" className="gallery-button">
                  &#8594;
                </button>
              </div>
            </div>
          </li>
          <li data-num="3">
            <img
              src={require("../assets/gal12.jpg")}
              alt="Attraction 12"
              className="gallery-img-gal"
            />
            <div className="gallery-float-gallery-content">
              <div className="gallery-content uk-text-left">
                <span className="gallery-highlight uk-block">
                  Galle Fort | Galle
                </span>
              </div>
              <div className="content-btn">
                <button type="button" className="gallery-button">
                  &#8594;
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Gallery;
