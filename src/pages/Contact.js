import React from 'react';
import '../styles/Contactformstyle.css';

function Contactform() {
  return (
    <div className="contact-container">
      <h1><center>Send  us a Message!</center></h1>
      <form>
        <input placeholder="Name" required />
        <input placeholder="Email" type="email" required />
        <input placeholder="Subject" />
        <textarea placeholder="Message" rows={4} required></textarea>
        <button type="Submit"> <h3>Send Message </h3> </button>
      </form>
    </div>
  );
}

export default Contactform;
