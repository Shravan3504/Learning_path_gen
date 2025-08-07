import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Footer: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    try {
      const response = await axios.post('http://localhost:5000/feedback', { 
        message: feedback 
      });
      if (response.status === 201) {
        setMessage('Feedback sent successfully!');
        setShowPopup(true);
        setFeedback('');
        setTimeout(() => setShowPopup(false), 3000);
      }
    } catch (error) {
      setMessage('Failed to send feedback.');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Learno</h3>
            <p className="text-gray-300">
              Transforming education through AI-powered personalized learning.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2">
              <p>📧 learno@gmail.com</p>
              <p>📞 7894561237</p>
              <p>🏢 KMIT, Hyderabad</p>
              <p>⏰ Open: 12:00 PM - 10:00 PM</p>
            </div>
          </div>

          {/* Feedback Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Send Feedback</h4>
            <div className="space-y-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Your feedback..."
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                rows={3}
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
              >
                Send Feedback
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-gray-400">
            © 2024 All Rights Reserved. Learno
          </p>
        </div>
      </div>

      {/* Feedback Popup */}
      {showPopup && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg z-50">
          {message}
        </div>
      )}
    </footer>
  );
};

export default Footer;
