import React, { createContext, useState, useEffect } from 'react';

const ImagesContext = createContext({});

export const ImagesProvider = ({ children }) => {
  const [images, setImages] = useState({});

  // Load images on component mount (or use a lazy loading approach)
  useEffect(() => {
    const importImages = async () => {
      const context = require.context('../assets', true, /\.(png|jpg|jpeg|svg)$/);
      const images = {};
      context.keys().forEach((key) => {
        images[key.slice(2)] = context(key).default; // Use default for image import
      });
      setImages(images);
    };
    importImages();
  }, []);

  return <ImagesContext.Provider value={images}>{children}</ImagesContext.Provider>;
};

export const useImages = () => (ImagesContext);