import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ImagesProvider } from "./components/context";
import Home from "./pages/Home";
import Questionnaire from "./pages/Questionnaire";
import Locations from "./pages/Locations";
import Nopage from "./pages/Nopage";
import Gallery from "./pages/Gallery";
import Event from "./pages/Event";
import Login from './pages/Login.js';
import CurrencyConverter from './pages/CurrencyConverter.js';
import About from './pages/About.js';
// import Test from './pages/Test.js';


function App() {
  return (
    <ImagesProvider>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
          </Route>
          <Route path="/Home.js" element={<Home />} />
          <Route path="/Questionnaire.js" element={<Questionnaire />} />
          <Route path="/Locations.js" element={<Locations />} />
          <Route path="/Gallery.js" element={<Gallery />} />
          <Route path="/Event.js" element={<Event />} />
          <Route path="/Login.js" element={<Login />} />
          <Route path="/Currency" element={<CurrencyConverter />} />
          <Route path="/About.js" element={<About />} />

          {/* <Route path="/Test" element={<Test />} /> */}
          <Route path="*" element={<Nopage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </ImagesProvider>
  );
}

export default App;
