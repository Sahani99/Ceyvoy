import { useState } from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactDOM from "react-dom/client";
import '../styles/Questionnaire.css';

function Questionnaire() {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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
  };

  return (
    <div id="questionnaire">
      <form onSubmit={handleSubmit}>
        {/* Budget */}
        <div className="form-section">
          <label>
            Select your budget:
            <select name="budget" value={formData.budget} onChange={handleChange} required>
              <option value="">Select your budget:</option>
              <option value="budget1">1000-2000</option>
              <option value="budget2">2000-3000</option>
              <option value="budget3">3000-4000</option>
            </select>
          </label>
        </div>

        {/* Number of Members */}
        <div className="form-section">
          <label>
            Number of members:
            <input
              type="number"
              name="NoOfMembers"
              value={formData.NoOfMembers}
              onChange={handleChange}
              step="1"
              required
            />
          </label>
        </div>

        {/* Trip Type */}
        <div className="form-section">
          <label>
            Select your trip type:
            <select name="triptype" value={formData.triptype} onChange={handleChange} required>
              <option value="">Select your trip type:</option>
              <option value="trip1">Trip type 1</option>
              <option value="trip2">Trip type 2</option>
              <option value="trip3">Trip type 3</option>
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
              value="forest"
              checked={formData.environments.includes('forest')}
              onChange={handleChange}
            />
            Forest
          </label>
          <label>
            <input
              type="checkbox"
              name="environments"
              value="beach"
              checked={formData.environments.includes('beach')}
              onChange={handleChange}
            />
            Beach
          </label>
          <label>
            <input
              type="checkbox"
              name="environments"
              value="mountains"
              checked={formData.environments.includes('mountains')}
              onChange={handleChange}
            />
            Mountains
          </label>
          <label>
            <input
              type="checkbox"
              name="environments"
              value="desert"
              checked={formData.environments.includes('desert')}
              onChange={handleChange}
            />
            Desert
          </label>
        </div>

        {/* Language Spoken */}
        <div className="form-section">
          <label>
            Select a language:
            <select name="language" value={formData.language} onChange={handleChange} required>
              <option value="language1">Language 1</option>
              <option value="language2">Language 2</option>
              <option value="language3">Language 3</option>
            </select>
          </label>
        </div>

        {/* Arrival Date */}
        <div className="form-section">
          <label>Date of Arrival:</label>
          <DatePicker
            selected={formData.startDate}
            onChange={handleDateChange}
            minDate={new Date()}
            maxDate={new Date(nextYear, 11, 31)} // Set max date to the end of next year
          />
          <label>
            Number of night staying:
            <input
              type="number"
              name="Stayingnights"
              value={formData.Stayingnights}
              onChange={handleChange}
              step="1"
              required
            />
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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Questionnaire />);
export default Questionnaire;
