import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const NotFound = () => {
  return (
    <section className="flex h-full min-h-screen flex-col">
      {/* navbar */}
      <Header />
      {/* flex grow */}
      <div className="mt-24 flex flex-grow flex-col" />

      <div className="flex min-h-96 flex-col items-center justify-center">
        <h1 className="text-center text-4xl font-bold text-gray-800">
          404 - Page Not Found
        </h1>
        <Link
          to="/"
          className="mt-4 rounded-md bg-sky-600 px-3 py-2 text-sky-100 hover:bg-sky-700"
        >
          Go back to home
        </Link>
      </div>

      {/* flex grow */}
      <div className="flex flex-grow flex-col" />
      {/* footer */}
      <Footer />
    </section>
  );
};

export default NotFound;
