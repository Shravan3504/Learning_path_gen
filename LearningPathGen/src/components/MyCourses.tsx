import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const { removeCourse } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [savedCourses, setSavedCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { user } = useUser();
  const firstName = user?.firstName;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!firstName) return;

      try {
        const response = await fetch(`http://localhost:5000/api/courses/get-courses/${firstName}`);
        const data = await response.json();

        if (data.message === "No courses found for this username") {
          setSavedCourses([]);
        } else if (!response.ok) {
          throw new Error('Failed to fetch courses');
        } else {
          setSavedCourses(data);
        }
      } catch (err) {
        if (err instanceof Error && err.message !== 'Failed to fetch courses') {
          setError('Failed to load courses. Please try again later.');
          console.error('Error fetching courses:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [firstName]);

  const handleDeleteCourse = (courseName: string) => {
    setCourseToDelete(courseName);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (courseToDelete) {
      try {
        await fetch(`http://localhost:5000/api/courses/delete-course/${firstName}/${courseToDelete}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        removeCourse(courseToDelete);
        setSavedCourses((prevCourses) => prevCourses.filter((course) => course.courseName !== courseToDelete));
      } catch (error) {
        console.error('Error deleting course:', error);
        setError('Failed to delete the course. Please try again.');
      } finally {
        setIsModalOpen(false);
        setCourseToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setCourseToDelete(null);
  };

  const handleViewRoadmap = (course: any) => {
    sessionStorage.setItem('selectedCourse', JSON.stringify(course));
    navigate(`/map/${encodeURIComponent(course.courseName)}`);
  };

  const handleDownload = (course: any) => {
    const content = `Title: ${course.courseName}\nDescription: ${course.skillLevel}\nRoadmap:\n${JSON.parse(course.roadmap || '[]')
      .map((item: any, idx: number) => `${idx + 1}. ${item.title}: ${item.description}`)
      .join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${course.courseName}.txt`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Saved Courses</h1>

      {savedCourses.length === 0 ? (
        <p className="text-center text-gray-500">You haven't saved any courses yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {savedCourses.map((course, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md border">
              <h2 className="text-xl font-extrabold mb-2">{course.courseName}</h2>
              <p className="text-gray-600 mb-2">
                <strong>Skill Level:</strong> {course.skillLevel}
              </p>
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => handleViewRoadmap(course)}
                  className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  View Roadmap
                </button>
                <button
                  onClick={() => handleDownload(course)}
                  className="bg-green-500 text-white py-2 rounded-md hover:bg-green-700"
                >
                  Download Course
                </button>
                <button
                  onClick={() => handleDeleteCourse(course.courseName)}
                  className="bg-red-500 text-white py-2 rounded-md hover:bg-red-700"
                >
                  Delete Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold text-center mb-4">
              Are you sure you want to delete this course?
            </h2>
            <div className="flex justify-between">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;