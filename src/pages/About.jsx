import Brand from "@/components/Brand";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* header */}
      <Header />

      {/* flex grow for fill space */}
      <div className="flex-grow" />

      {/* about */}
      <section className="container mx-auto mt-20 px-4 py-8">
        <h1 className="mb-8 text-center text-2xl font-medium md:text-3xl">
          About Us
        </h1>

        <p className="text-gray-800">
          Your ultimate travel companion for exploring the wonders of Sri Lanka.
          Our mission is to enhance your travel experience by offering
          personalized travel packages and tailored recommendations that align
          with your interests, budget, and travel goals. At CeyVoy, we
          understand that every traveler is unique, which is why we provide
          custom itineraries designed just for you. Our user-friendly platform
          allows you to easily plan your trips, discover new destinations, and
          access valuable insights and updates to make your journey memorable.
          Whether you&apos;re a traveler, tour guide, or accommodation provider,
          CeyVoy is here to ensure that your travel plans are seamless,
          enjoyable, and unforgettable. Join us on this journey and discover the
          beauty of Sri Lanka with personalized precision and care.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center">
          <Brand />
          <p className="text-xs text-gray-700">
            CeyVoy is a registered trademark of CeyVoy (Pvt) Ltd.
          </p>
        </div>
      </section>

      {/* flex grow for fill space */}
      <div className="flex-grow" />

      {/* footer */}
      <Footer />
    </div>
  );
};

export default About;
