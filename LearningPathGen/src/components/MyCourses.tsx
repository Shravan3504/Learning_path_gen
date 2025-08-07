import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Download, 
  Trash2, 
  Eye, 
  GraduationCap, 
  Calendar, 
  Star,
  AlertTriangle,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const MyCourses = () => {
  const { removeCourse } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [savedCourses, setSavedCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);
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
  const courseNameSlug = course.courseName.toLowerCase().replace(/\s+/g, '-');
  navigate(`/${course.username}/${courseNameSlug}`);
};

  const handleDownload = (course: any) => {
    try {
      let roadmapContent = '';
      
      if (course.roadmap) {
        try {
          const roadmapData = JSON.parse(course.roadmap);
          if (Array.isArray(roadmapData)) {
            roadmapContent = roadmapData
              .map((item: any, idx: number) => `${idx + 1}. ${item.title || item.name || 'Step'}: ${item.description || item.content || ''}`)
              .join('\n');
          } else {
            roadmapContent = 'Roadmap data format not recognized';
          }
        } catch (parseError) {
          console.error('Error parsing roadmap JSON:', parseError);
          roadmapContent = course.roadmap;
        }
      } else {
        roadmapContent = 'No roadmap available';
      }

      const content = `Title: ${course.courseName}\nSkill Level: ${course.skillLevel}\nRoadmap:\n${roadmapContent}`;

      const blob = new Blob([content], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${course.courseName.replace(/[^a-z0-9]/gi, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading course:', error);
      setError('Failed to download course. Please try again.');
    }
  };

  // Helper function to get skill level color
  const getSkillLevelColor = (skillLevel: string) => {
    switch (skillLevel?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper function to get course icon based on name
  const getCourseIcon = (courseName: string) => {
    const name = courseName.toLowerCase();
    if (name.includes('javascript') || name.includes('js')) return '🟨';
    if (name.includes('react')) return '⚛️';
    if (name.includes('python')) return '🐍';
    if (name.includes('java')) return '☕';
    if (name.includes('css') || name.includes('html')) return '🎨';
    if (name.includes('node')) return '💚';
    if (name.includes('database') || name.includes('sql')) return '🗄️';
    return '📚';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-r-4 border-purple-600 animate-ping mx-auto"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 font-medium">Loading your learning journey...</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100">
          <div className="text-6xl mb-4">😔</div>
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 px-6 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              MY LEARNING JOURNEY
            </h1>
            <p className="text-xl text-gray-600 mb-4 mt-15">
              Track your progress and continue your learning adventure
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{savedCourses.length} Courses</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Keep Learning!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {savedCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-8xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Start Your Learning Adventure!</h3>
              <p className="text-gray-600 mb-8 text-lg">
                You haven't saved any courses yet. Let's begin your journey to mastering new skills!
              </p>
              <button
                onClick={() => navigate('/learn')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center space-x-2 mx-auto"
              >
                <Sparkles className="w-6 h-6" />
                <span>Start Learning Now</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {savedCourses.map((course, index) => (
              <div
                key={`${course.courseName}-${index}`}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden transform hover:scale-105"
                onMouseEnter={() => setHoveredCourse(index)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                {/* Course Header */}
                <div className="relative p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">
                      {getCourseIcon(course.courseName)}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSkillLevelColor(course.skillLevel)}`}>
                      {course.skillLevel}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {course.courseName}
                  </h2>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Saved Course</span>
                    </div>
                    {course.roadmap && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-green-600 font-medium">Roadmap Ready</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Course Body */}
                <div className="p-6">
                  {course.roadmap ? (
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-green-600">Learning Path Available</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Your personalized roadmap is ready to guide your learning journey
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-500">No Roadmap</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Roadmap not available for this course
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
  onClick={() => handleViewRoadmap(course)}
  className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm font-semibold"
>
  🗺️ View Roadmap
</button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleDownload(course)}
                        className="py-2 px-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-1 text-sm"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCourse(course.courseName)}
                        className="py-2 px-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-1 text-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                {hoveredCourse === index && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 pointer-events-none rounded-2xl"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Delete Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 transform animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Delete Course?
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Are you sure you want to delete <strong>"{courseToDelete}"</strong>? 
                This action cannot be undone and you'll lose your progress.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
              >
                Keep Course
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
