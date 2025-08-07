import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  name: string;
  role: string;
  review: string;
  icon: string;
  color: string;
}

const reviews: Review[] = [
  {
    name: "Course Selection",
    role: "step-1",
    review: "Select your course from our listed courses you wanted to learn...",
    icon: "📚",
    color: "from-blue-500 to-purple-600"
  },
  {
    name: "Quiz",
    role: "step-2", 
    review: "Select your grip in the course and attempt our test for testing your grip in the course you wanted to learn",
    icon: "🧩",
    color: "from-green-500 to-blue-500"
  },
  {
    name: "Path",
    role: "step-3",
    review: "Get your personalized path for learning the course effectively and save the course for the future",
    icon: "🎯",
    color: "from-purple-500 to-pink-500"
  },
];

const MyCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto py-16 px-6">
      <motion.h2 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800"
      >
        How <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Learno</span> Works
      </motion.h2>

      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -300, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="p-8 md:p-12 text-center relative"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${reviews[currentIndex].color} opacity-5`}></div>
            
            {/* Step Number */}
            <div className="relative z-10">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${reviews[currentIndex].color} text-white font-bold text-xl mb-6 shadow-lg`}>
                {currentIndex + 1}
              </div>
              
              {/* Icon */}
              <div className="text-6xl mb-6 animate-bounce">
                {reviews[currentIndex].icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                {reviews[currentIndex].name}
              </h3>

              {/* Role/Step */}
              <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${reviews[currentIndex].color} text-white text-sm font-medium mb-6 shadow-md`}>
                {reviews[currentIndex].role}
              </div>

              {/* Review Text */}
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                "{reviews[currentIndex].review}"
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center space-x-3 mt-8">
        {reviews.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-purple-600 w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-6 bg-gray-200 rounded-full h-1 overflow-hidden">
        <motion.div
          key={currentIndex}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          className={`h-full bg-gradient-to-r ${reviews[currentIndex].color} rounded-full`}
        />
      </div>
    </div>
  );
};

export default MyCarousel;
