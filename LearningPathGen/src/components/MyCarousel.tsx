import React, { useEffect, useState } from "react";

interface Review {
  name: string;
  role: string;
  review: string;
}

const reviews: Review[] = [
  {
    name: "Course Selection",
    role: "step-1",
    review:
      "Select your course from our listed courses you wanted to learn...",
  },
  {
    name: "Quiz",
    role: "step-2",
    review:
      "Select your grip in the course and attempt our test for testing your grip in the course you wanted to learn",
  },
  {
    name: "Path",
    role: "step-3",
    review:
      "Get your personlized path for learning the course effectively and save the course for the future",
  },
];

const MyCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full bg-gray-100 py-10 overflow-hidden"
      role="region"
      aria-label="User Reviews Carousel"
    >
      <h2 className="text-2xl font-semibold text-center text-blue-600 mb-8">
        STEPS FOR YOUR PATH...
      </h2>
      <div className="w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            width: `${reviews.length * 100}%`,
            transform: `translateX(-${currentIndex * (100 / reviews.length)}%)`,
          }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full px-8"
              style={{ width: `${100 / reviews.length}%` }}
            >
              <div className="text-center">
                <p className="text-lg italic text-gray-700 leading-relaxed">
                  "{review.review}"
                </p>
                <h3 className="mt-4 font-bold text-gray-900 text-xl">
                  {review.name}
                </h3>
                <p className="text-sm text-gray-500">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Pagination Dots */}
      <div className="mt-6 flex justify-center space-x-3">
        {reviews.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-3 w-3 rounded-full transition-all ${
              currentIndex === index ? "bg-blue-500 scale-110" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default MyCarousel;
