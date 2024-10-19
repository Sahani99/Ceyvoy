import { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // if the user scrolls down, show the button
      window.scrollY > 500 ? setIsVisible(true) : setIsVisible(false);
    };
    // listen for scroll events
    window.addEventListener("scroll", toggleVisibility);

    // clear the listener on component unmount
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  // handles the animation when scrolling to the top
  const scrollToTop = () => {
    isVisible &&
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  };

  return (
    <button
      className={`fixed right-3 z-[999] flex h-10 w-10 items-center justify-center rounded-full bg-sky-700 text-white outline-none backdrop-blur-lg backdrop-filter duration-200 ease-in bottom-4 ${
        isVisible ? "scale-100" : "scale-0"
      }`}
      onClick={scrollToTop}
    >
      <MdKeyboardDoubleArrowUp className="h-6 w-6" />
      <span className="sr-only">Back to top</span>
    </button>
  );
};

export default BackToTop;
