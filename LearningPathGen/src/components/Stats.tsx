import React from 'react';

const Stats: React.FC = () => {
  return (
    <div className="learno-container bg-gradient-to-r from-[#f0f4ff] to-white text-gray-800">
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Learno</h1>
        <p className="text-lg text-gray-600 mt-4">
          AI-powered learning platform.
        </p>
        <div className="stats flex flex-wrap justify-center gap-6 mt-10">
          <div className="stat p-6 rounded-lg shadow-lg bg-[#f0f4ff] w-64 flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-gray-800">PATH</h2>
            <p className="font-semibold text-gray-800">Personlized</p>
            <p className="text-gray-800">
              Learno has helps half a students achieve their learning
              goals.
            </p>
          </div>
          <div className="stat p-6 rounded-lg shadow-lg bg-[#4C6BC8] text-white w-64 flex flex-col justify-center">
            <h2 className="text-4xl font-bold">1000+</h2>
            <p className="font-semibold">Courses Available</p>
            <p>
              A wide range of courses tailored to various learning needs.
            </p>
          </div>
          <div className="stat p-6 rounded-lg shadow-lg bg-[#f0f4ff] w-64 flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-gray-800">Experience</h2>
            <p className="font-semibold text-gray-800">feedbacks</p>
            <p className="text-gray-800">
              users love the personalized learning experience Learno
              provides.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
