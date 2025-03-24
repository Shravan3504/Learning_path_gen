import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const MapView = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const course = JSON.parse(sessionStorage.getItem('selectedCourse') || '{}');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Back to Courses
      </button>
      <h1 className="text-3xl font-bold mb-6">{courseName} - Roadmap</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4"><strong>Skill Level:</strong> {course.skillLevel}</p>
        <div className="space-y-6">
          {JSON.parse(course.roadmap || '[]').map((item: any, idx: number) => (
            <div key={idx} className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-xl text-gray-800">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapView;