import { useState, useEffect } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import '../styles/Questionnaire.css';

function Questionnaire() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const [formData, setFormData] = useState({
    budget: '',
    NoOfMembers: '',
    triptype: '',
    environments: [],
    language: '',
    Stayingnights: '',
    startDate: new Date()
  });

  const [budgetOptions, setBudgetOptions] = useState([
    { value: 'budget1', label: 'Below LKR 50,000' },
    { value: 'budget2', label: 'LKR 50,000 - LKR 100,000' },
    { value: 'budget3', label: 'LKR 100,000 - LKR 200,000' },
    { value: 'budget4', label: 'LKR 200,000 - LKR 300,000' },
    { value: 'budget5', label: 'LKR 300,000 - LKR 500,000' },
    { value: 'budget6', label: 'LKR 500,000 - LKR 700,000' },
    { value: 'budget7', label: 'Above LKR 700,000' },
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'NoOfMembers' && (value < 0 || value > 25)) {
      return;
    }
    if (name === 'stayingnights' && (value < 0 || value > 30)) {
      return;
    }
    if (type === 'checkbox') {
      setFormData((prevData) => ({
        ...prevData,
        environments: checked
          ? [...prevData.environments, value]
          : prevData.environments.filter((env) => env !== value)
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      startDate: date
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);
    navigate('/Locations.js'); 
  };

  useEffect(() => {
    const calculateMinBudget = () => {
      const { triptype, NoOfMembers, stayingnights } = formData;
      let minBudgetPerPersonPerNight;

      if (triptype === 'trip1') minBudgetPerPersonPerNight = 15000; // Low budget
      else if (triptype === 'trip2') minBudgetPerPersonPerNight = 50000; // Medium budget
      else if (triptype === 'trip3') minBudgetPerPersonPerNight = 600000; // High budget
      else return;

      const totalBudget = NoOfMembers * stayingnights * minBudgetPerPersonPerNight;
      
      const filteredOptions = [
        { value: 'budget1', label: 'Below LKR 50,000', limit: 50000 },
        { value: 'budget2', label: 'LKR 50,000 - LKR 100,000', limit: 100000 },
        { value: 'budget3', label: 'LKR 100,000 - LKR 500,000', limit: 500000 },
        { value: 'budget4', label: 'LKR 500,000 - LKR 1,000,000', limit: 1000000 },
        { value: 'budget5', label: 'LKR 1,000,000 - LKR 15,000,000', limit: 15000000 },
        { value: 'budget6', label: 'LKR 15,000,000 - LKR 20,000,000', limit: 20000000 },
        { value: 'budget7', label: 'LKR 20,000,000 - LKR 25,000,000', limit: 25000000 },
        { value: 'budget8', label: 'LKR 25,000,000 - LKR 30,000,000', limit: 30000000 },
        { value: 'budget9', label: 'LKR 30,000,000 - LKR 50,000,000', limit: 50000000 },
        { value: 'budget10', label: 'LKR 50,000,000 - LKR 70,000,000', limit: 70000000 },
        { value: 'budget11', label: 'LKR 70,000,000 - LKR 90,000,000', limit: 90000000 },
        { value: 'budget12', label: 'LKR 90,000,000 - LKR 100,000,000', limit: 100000000 },
        { value: 'budget13', label: 'Above LKR 100,000,000', limit: Infinity },
      ].filter(option => option.limit >= totalBudget);

      setBudgetOptions(filteredOptions);
    };

    calculateMinBudget();
  }, [formData]);

  return (
    <div id="questionnaire">
      <form onSubmit={handleSubmit}>
        {/* Trip Type */}
        <div className="form-section">
          <label>
            Select your trip type:
            <select name="triptype" value={formData.triptype} onChange={handleChange} required>
              <option value="" disabled>Select an option</option>
              <option value="trip1">Low budget </option>
              <option value="trip2">Medium budget</option>
              <option value="trip3">High budget</option>
            </select>
          </label>
        </div>

        {/* Number of Members */}
        <div className="form-section">
          <label>
            Number of Members:
            <input
              type="number"
              name="NoOfMembers"
              placeholder="Maximum number of members are 25"
              value={formData.NoOfMembers}
              onChange={handleChange}
              step="1"
              required
              min="0"
              max="25"
            />
          </label>
        </div>

                {/* Arrival Date */}
                <div className="form-section">
          <label>Date of Arrival:</label>
          <DatePicker
            selected={formData.startDate}
            onChange={handleDateChange}
            minDate={new Date()}
            maxDate={new Date(nextYear, 11, 31)}
          />
          <label>
            Number of night staying:
            <input
              type="number"
              name="stayingnights"
              value={formData.stayingnights}
              onChange={handleChange}
              step="1"
              required
              min={1}
            />
          </label>
        </div>

        {/* Budget */}
        <div className="form-section">
          <label>
            Select your budget:
            <select name="budget" value={formData.budget} onChange={handleChange} required>
            <option value="" disabled>Select your budget : </option>
              {budgetOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Preferred Environments */}
        <div className="form-section">
          <label>Preferred Environments:</label>
          <label>
            <input
              type="checkbox"
              name="environments"
              value="beach-side"
              checked={formData.environments.includes('beach-side')}
              onChange={handleChange}
            />
            Beach Side
          </label>
          <label>
            <input
              type="checkbox"
              name="environments"
              value="hill-side"
              checked={formData.environments.includes('hill-side')}
              onChange={handleChange}
            />
            Hill side
          </label>
          <label>
            <input
              type="checkbox"
              name="environments"
              value="city"
              checked={formData.environments.includes('city')}
              onChange={handleChange}
            />
            City
          </label>
          <label>
            <input
              type="checkbox"
              name="environments"
              value="rural"
              checked={formData.environments.includes('rural')}
              onChange={handleChange}
            />
            Rural
          </label>
          <label>
            <input
              type="checkbox"
              name="environments"
              value="monuments"
              checked={formData.environments.includes('monuments')}
              onChange={handleChange}
            />
            Monuments
          </label>
        </div>

        {/* Language Spoken */}
        <div className="form-section">
          <label>
            Select a language:
            <select name="language" value={formData.language} onChange={handleChange} required>
              <option value="language1">English</option>
              <option value="language2">Spanish</option>
              <option value="language3">German</option>
              <option value="language4">Russian</option>
              <option value="language5">Sinhala</option>
              <option value="language6">Hindi</option>
            </select>
          </label>
        </div>



        <input type="reset" onClick={() => setFormData({
          budget: '',
          NoOfMembers: '',
          triptype: '',
          environments: [],
          language: '',
          startDate: new Date()
        })} />
        <input type="submit" />
      </form>
    </div>
  );
}

export default Questionnaire;
