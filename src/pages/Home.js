import { Link } from 'react-router-dom';
import '../styles/Home.css';
import { useImages } from '../components/context';

const Home = () => {
  const images = useImages();
  console.log('Loaded images:', images); // Debugging line

  return (
    <div id="home-container">
      <div id="home">
      <div id="home-text">
        <Link to="/Questionnaire.js" className='link'>Plan your next holiday with us</Link>
      </div>
      </div>
      
    </div>
  );
};

export default Home;
