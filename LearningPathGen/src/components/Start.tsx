import React from 'react';

const Start: React.FC<{ navigateTo: (page: 'learn' | 'about') => void }> = ({ navigateTo }) => {
  return (
    <div
      className="hero-section bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dtnvkccyy/image/upload/v1726215192/f07f30d5-6ad9-44e0-9b12-f50306276310_lsk3li.jpg')`,
      }}
    >
      <div className="container h-full flex items-center justify-center px-4 sm:px-8">
        <div className="content-box text-center max-w-lg md:max-w-2xl bg-white bg-opacity-80 p-4 sm:p-6 rounded-lg shadow-lg">
          <h2 className="text-blue-600 text-xs sm:text-sm font-semibold">
            Tailored Learning Paths for Every Student
          </h2>
          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 mt-2">
            Revolutionize Your Learning Experience with AI
          </h1>
          <p className="text-gray-700 mt-4 text-sm sm:text-base">
            Learno leverages AI to continuously assess and adapt to each student's needs, ensuring real-time mastery of concepts. Say goodbye to traditional exams and hello to personalized learning.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigateTo('learn')}
              className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 text-center flex items-center justify-center text-sm sm:text-base"
            >
              Get Started
            </button>
            <button
              onClick={() => navigateTo('about')}
              className="text-gray-800 hover:text-gray-600 text-center flex items-center justify-center text-sm sm:text-base"
            >
              Learn More
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Start;
