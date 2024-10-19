import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/animations";
import { Link } from "react-router-dom";

const imagesArray = [
  "/images/slide01.jpg",
  "/images/slide02.jpeg",
  "/images/slide03.jpg",
  "/images/slide04.jpeg",
];

const contentArray = [
  {
    title: "Sigiriya",
    description:
      "Sigiriya is a fifth-century fortress in Sri Lanka which has been carved out of an inselberg, a hill of hard volcanic rock. It towers around 600 feet (182.8m) from the forest and gardens below, and has a flat top. This is where the palace of King Kasyapa once stood, reachable up a winding stone staircase.",
  },
  {
    title: "Ruwanwelisaya",
    description:
      "Ruwanwelisaya, also known as the Maha Thupa or the Great Stupa, is a stupa in Anuradhapura, Sri Lanka that was built in 140 BC by King Dutugemunu. It is considered the oldest stupa in Sri Lanka and one of the largest structures in the ancient world.",
  },
  {
    title: "St Clair's Waterfall",
    description:
      "St Clair's Waterfall, also called “St. Clair's Falls, is an incredible waterfall in the Thalawakele area of Sri Lanka. It is considered one of the widest waterfalls on the island. Some call this the “Little Niagara of Sri Lanka.",
  },
  {
    title: "Nine Arches Bridge",
    description:
      "The Nine Arch Bridge also called the Bridge in the Sky, is a viaduct bridge in Sri Lanka and one of the best examples of colonial-era railway construction in the country.",
  },
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  // use effect for image transition
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 3 ? 0 : prev + 1));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-screen min-h-[35rem]">
      {imagesArray.map((image, index) => (
        <motion.img
          key={index}
          src={image}
          alt="hero"
          className="absolute left-0 top-0 z-0 h-full w-full object-cover"
          initial="initial"
          animate={currentImage === index ? "animate" : "initial"}
          variants={fadeIn}
        />
      ))}

      <div className="absolute start-0 top-0 z-[1] h-full w-full bg-black/50" />

      <div className="absolute start-0 top-0 z-[2] flex h-full w-full flex-col items-center justify-center text-center text-white">
        {contentArray.map((content, index) => {
          return (
            <motion.div
              initial="initial"
              animate={currentImage === index ? "animate" : "initial"}
              variants={fadeIn}
              key={index}
              className="absolute max-w-2xl"
            >
              <h2 className="font-serif text-2xl font-medium uppercase tracking-widest md:text-3xl">
                &ldquo;{content.title}&rdquo;
              </h2>
              <p className="mb-8 mt-2 text-sm md:text-base">
                {content.description}
              </p>
              <Link
                to={"get-start"}
                className="rounded-md border-2 border-white bg-transparent px-4 py-2 text-white duration-300 hover:bg-white hover:text-black"
              >
                Plan Your Next Holiday
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Hero;
