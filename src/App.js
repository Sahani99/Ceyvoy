import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ImagesProvider } from './components/context';
import Home from './pages/Home';
import Questionnaire from './pages/Questionnaire';
import Locations from './pages/Locations';
import Nopage from './pages/Nopage';

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
          <Route path="*" element={<Nopage />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </ImagesProvider>
  );
}

export default App;
