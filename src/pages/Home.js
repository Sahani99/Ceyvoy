import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { useImages } from '../components/context';

const Home = () => {
  const images = useImages();
  console.log('Loaded images:', images); // Debugging line

  return (
    <div id="home-container">
      <div id="home">
      </div>
      <div id="home-text">
        <h1>Welcome to CeyVoy</h1>
        <Link to="/Questionnaire.js">Plan your trip with us</Link>
      </div>
    </div>
  );
};

export default Home;
