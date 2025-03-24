import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/feedback', { message: feedback });
      if (response.status === 201) {
        setMessage('Feedback sent successfully!');
        setShowPopup(true); // Show the pop-up
        setFeedback('');

        // Hide the pop-up after 3 seconds
        setTimeout(() => setShowPopup(false), 3000);
      }
    } catch (error) {
      setMessage('Failed to send feedback.');
      setShowPopup(true); // Show the pop-up on error
      setTimeout(() => setShowPopup(false), 3000); // Hide it after 3 seconds
    }
  };

  return (
    <div className="bg-[#1a2327] text-white font-sans w-full">
      <div className="px-4 py-12 text-center">
        <h1 className="text-3xl pb-2">Connect with Us</h1>
        <div className="info-section flex flex-wrap justify-center gap-12 mb-12">
          <div className="info-item flex flex-col items-center text-center">
            <i className="fas fa-phone-alt rotate-90 text-3xl text-blue-600 mb-2"></i>
            <h3 className="text-lg text-blue-600 mb-2">Contacts</h3>
            <p>learno@gmail.com</p>
            <p>7894561237</p>
          </div>
          <div className="info-item flex flex-col items-center text-center">
            <i className="fas fa-map-marker-alt text-3xl text-blue-600 mb-2"></i>
            <h3 className="text-lg text-blue-600 mb-2">Location</h3>
            <p>KMIT</p>
            <p>Hyderbad</p>
          </div>
          <div className="info-item flex flex-col items-center text-center">
            <i className="fas fa-clock text-3xl text-blue-600 mb-2"></i>
            <h3 className="text-lg text-blue-600 mb-2">Working hours</h3>
            <p>Open: 12:00 pm</p>
            <p>Closed: 10:00 pm</p>
          </div>
        </div>

        <div className="social-icons my-6 flex justify-center gap-6">
          <Link to="#" className="text-white text-2xl hover:text-gray-300 transition">
            <i className="fab fa-facebook-f"></i>
          </Link>
          <Link to="#" className="text-white text-2xl hover:text-gray-300 transition">
            <i className="fab fa-twitter"></i>
          </Link>
          <Link to="#" className="text-white text-2xl hover:text-gray-300 transition">
            <i className="fab fa-linkedin-in"></i>
          </Link>
          <Link to="#" className="text-white text-2xl hover:text-gray-300 transition">
            <i className="fab fa-instagram"></i>
          </Link>
        </div>

        <div className="footer mb-4">
          <p className="text-sm">© All Rights Reserved. Learno</p>
        </div>
      </div>

      <button className="scroll-up fixed bottom-5 right-5 bg-teal-100 rounded-full p-2 cursor-pointer">
        <i className="fas fa-chevron-up text-[#1a2327] text-lg"></i>
      </button>

      {showPopup && (
        <div className="popup fixed bottom-5 right-5 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default Footer;
