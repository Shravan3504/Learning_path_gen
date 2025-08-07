import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Check, Clock, Lock } from 'lucide-react';
import { toPng } from 'html-to-image';

interface CourseData {
  username: string;
  courseName: string;
  skillLevel: string;
  roadmap: string;
  createdAt?: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  duration: string;
  prerequisites: string[];
  isCompleted: boolean;
  isUnlocked: boolean;
  order: number;
}

interface Progress {
  courseId: string;
  completedChapters: string[];
  currentChapter: string | null;
  lastUpdated: string;
}

const MapView = () => {
  const { username, courseName } = useParams();
  const navigate = useNavigate();
  const [currentCourse, setCurrentCourse] = useState<CourseData | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load progress from localStorage
  const loadProgress = (courseId: string): Progress => {
    const savedProgress = localStorage.getItem(`course_progress_${courseId}`);
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    
    return {
      courseId,
      completedChapters: [],
      currentChapter: null,
      lastUpdated: new Date().toISOString()
    };
  };

  // Save progress to localStorage
  const saveProgress = (newProgress: Progress) => {
    localStorage.setItem(`course_progress_${newProgress.courseId}`, JSON.stringify(newProgress));
    setProgress(newProgress);
  };

  // Create chapters with progress tracking
  const createChaptersWithProgress = (milestones: any[], courseProgress: Progress) => {
    const chaptersWithProgress: Chapter[] = milestones.map((milestone, index) => {
      const isCompleted = courseProgress.completedChapters.includes(milestone.id);
      const prerequisites = milestone.prerequisites || [];
      const arePrerequisitesMet = prerequisites.length === 0 || 
        prerequisites.every(prereq => courseProgress.completedChapters.includes(prereq));

      return {
        id: milestone.id,
        title: milestone.title,
        description: milestone.description,
        duration: milestone.duration,
        prerequisites,
        isCompleted,
        isUnlocked: index === 0 || arePrerequisitesMet,
        order: index
      };
    });

    return chaptersWithProgress.sort((a, b) => a.order - b.order);
  };

  // Mark chapter as complete
  const markChapterComplete = (chapterId: string) => {
    if (!progress || !currentCourse) return;

    const updatedCompletedChapters = progress.completedChapters.includes(chapterId)
      ? progress.completedChapters
      : [...progress.completedChapters, chapterId];

    const newProgress: Progress = {
      ...progress,
      completedChapters: updatedCompletedChapters,
      currentChapter: chapterId,
      lastUpdated: new Date().toISOString()
    };

    saveProgress(newProgress);

    // Update chapters with new progress
    const roadmapData = JSON.parse(currentCourse.roadmap);
    const updatedChapters = createChaptersWithProgress(roadmapData, newProgress);
    setChapters(updatedChapters);
  };

  // Calculate overall progress
  const calculateProgress = () => {
    if (chapters.length === 0) return 0;
    const completedCount = chapters.filter(chapter => chapter.isCompleted).length;
    return Math.round((completedCount / chapters.length) * 100);
  };

  useEffect(() => {
    const fetchCourseRoadmap = async () => {
      try {
        setLoading(true);
        setError(null);

        if (username && courseName) {
          const response = await fetch(`http://localhost:5000/api/courses/get-courses/${username}`);
          if (response.ok) {
            const courses = await response.json();
            const course = courses.find((c: CourseData) => 
              c.courseName.toLowerCase().replace(/\s+/g, '-') === courseName?.toLowerCase()
            );

            if (course) {
              setCurrentCourse(course);
              const courseId = `${username}_${course.courseName}`;
              
              // Load progress
              const courseProgress = loadProgress(courseId);
              setProgress(courseProgress);

              try {
                const roadmapData = JSON.parse(course.roadmap);
                const chaptersWithProgress = createChaptersWithProgress(roadmapData, courseProgress);
                setChapters(chaptersWithProgress);
              } catch (parseError) {
                console.error('Error parsing roadmap:', parseError);
                setError('Invalid roadmap data format');
              }
            } else {
              setError('Course not found');
            }
          } else {
            setError('Failed to fetch course data');
          }
        } else {
          setError('Course information not available');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to load course roadmap');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseRoadmap();
  }, [username, courseName]);

  const downloadRoadmap = () => {
    const element = document.querySelector('.roadmap-container') as HTMLElement;
    if (element) {
      toPng(element, { backgroundColor: '#fff' }).then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${currentCourse?.courseName}-roadmap.png`;
        link.href = dataUrl;
        link.click();
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/my-courses')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  const overallProgress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-gray-700 hover:text-blue-600"
            >
              <ArrowLeft size={20} />
              <span>Back to My Courses</span>
            </button>
          </div>
          
          <button
            onClick={downloadRoadmap}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Download size={20} />
            <span>Download</span>
          </button>
        </div>

        <div className="roadmap-container">
          {/* Course Info */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {currentCourse?.courseName || 'Course Roadmap'}
                </h1>
                <p className="text-gray-600">
                  {currentCourse?.skillLevel} Level • {chapters.length} Chapters
                </p>
              </div>
              {overallProgress === 100 && (
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  ✓ Completed
                </div>
              )}
            </div>
          </div>

          {/* Overall Progress Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Course Progress</h2>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-4xl font-bold mb-2">{overallProgress}%</div>
                <p className="text-blue-100">
                  {progress?.completedChapters.length || 0} of {chapters.length} chapters completed
                </p>
              </div>
            </div>
            
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Chapters List */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">📚</span>
              Learning Chapters
            </h2>

            {chapters.length > 0 ? (
              <div className="space-y-4">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                      chapter.isCompleted
                        ? 'bg-green-50 border-green-200 shadow-md'
                        : chapter.isUnlocked
                        ? 'bg-white border-blue-200 shadow-md hover:shadow-lg'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Chapter Number */}
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        chapter.isCompleted
                          ? 'bg-green-500'
                          : chapter.isUnlocked
                          ? 'bg-blue-500'
                          : 'bg-gray-400'
                      }`}>
                        {index + 1}
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {chapter.title}
                          </h3>
                          {chapter.isCompleted && <Check className="text-green-500" size={20} />}
                          {!chapter.isCompleted && chapter.isUnlocked && <Clock className="text-blue-500" size={20} />}
                          {!chapter.isUnlocked && <Lock className="text-gray-400" size={20} />}
                        </div>

                        <p className="text-gray-600 mb-3">{chapter.description}</p>

                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            📚 {chapter.duration}
                          </span>

                          {chapter.prerequisites.length > 0 && (
                            <span className="text-sm text-gray-500">
                              Prerequisites: {chapter.prerequisites.length} chapter(s)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {chapter.isCompleted ? (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                ✅ Completed
                              </span>
                            ) : chapter.isUnlocked ? (
                              <button
                                onClick={() => markChapterComplete(chapter.id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                              >
                                Mark Complete
                              </button>
                            ) : (
                              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm font-medium">
                                🔒 Locked
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Chapter Progress Bar */}
                        {chapter.isUnlocked && (
                          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                chapter.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: chapter.isCompleted ? '100%' : '0%' }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  This course doesn't have chapters yet.
                </h3>
                <p className="text-gray-500">
                  Keep learning and track your progress! 🚀
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
