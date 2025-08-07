import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Download, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { RoadmapView } from './RoadmapView';
import { Node, Edge, MarkerType } from 'react-flow-renderer';
import { toPng } from 'html-to-image';
import { useUser } from '@clerk/clerk-react';

const DEFAULT_MILESTONES = [
  {
    id: 'basics',
    title: 'Fundamentals',
    description: 'Core concepts and basics',
    duration: '2-3 weeks',
    prerequisites: []
  },
  {
    id: 'intermediate',
    title: 'Intermediate Concepts',
    description: 'Building on the basics',
    duration: '3-4 weeks',
    prerequisites: ['basics']
  },
  {
    id: 'advanced',
    title: 'Advanced Topics',
    description: 'Advanced concepts and best practices',
    duration: '4-6 weeks',
    prerequisites: ['intermediate']
  }
];

export const Results = () => {
  const { selectedTopic, skillLevel, questions, userAnswers, learningPath, setLearningPath, reset } = useStore();
  const [roadmapElements, setRoadmapElements] = useState<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const [error, setError] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<{ [key: string]: string }>({});
  const [showReview, setShowReview] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);

  // Calculate score based on attempted questions only
  const attemptedQuestions = questions.slice(0, userAnswers.length);
  const score = userAnswers.reduce((acc, answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    return acc + (question?.correctAnswer === answer.answer ? 1 : 0);
  }, 0);

  const percentage = attemptedQuestions.length > 0 ? (score / attemptedQuestions.length) * 100 : 0;

  // Generate explanations for all questions
  const generateExplanations = async () => {
    try {
      const apiKeys = import.meta.env.VITE_GEMINI_API_KEY?.split(',').map((key: string)=> key.trim());
      const randomApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

      const genAI = new GoogleGenerativeAI(randomApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      const explanationsData: { [key: string]: string } = {};
      
      for (const question of questions) {
        const prompt = `
          For this question: "${question.text}"
          Options: ${question.options.join(', ')}
          Correct Answer: ${question.options[question.correctAnswer]}
          
          Provide a clear, concise explanation (2-3 sentences) of why this is the correct answer and why the other options are incorrect.
        `;
        
        try {
          const result = await model.generateContent(prompt);
          const explanation = result.response.text();
          explanationsData[question.id] = explanation;
        } catch (error) {
          explanationsData[question.id] = "Explanation not available.";
        }
      }
      
      setExplanations(explanationsData);
    } catch (error) {
      console.error('Error generating explanations:', error);
    }
  };

  // Handle milestone navigation
  const handleMilestoneClick = (milestone: any) => {
    // Create a more detailed learning page URL or action
    const learningUrl = `/learn/${selectedTopic?.name?.toLowerCase().replace(/\s+/g, '-')}/${milestone.id}`;
    
    // You can either:
    // 1. Navigate to a learning page (if you have routing set up)
    // window.location.href = learningUrl;
    
    // 2. Or show detailed content in a modal/new section
    alert(`Starting ${milestone.title} module.\n\nDuration: ${milestone.duration}\nDescription: ${milestone.description}`);
    
    // 3. Or redirect to external learning resources
    // For now, showing an alert with more detailed info
  };

  const createRoadmapElements = (milestones: any[]) => {
    const nodes: Node[] = milestones.map((milestone, index) => ({
      id: milestone.id,
      type: 'default',
      position: { 
        x: 400 * (index % 3),
        y: 300 * Math.floor(index / 3)
      },
      data: {
        label: (
          <div className="p-5 text-center">
            <div className="font-semibold text-lg">{milestone.title}</div>
            <div className="text-sm text-gray-500 mb-2">{milestone.duration}</div>
            <div className="text-xs text-gray-600 mb-3 px-2">{milestone.description}</div>
            <button
              onClick={() => handleMilestoneClick(milestone)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">🚀</span>
                Start Learning
              </span>
            </button>
          </div>
        ),
      },
      style: {
        background: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        padding: '12px',
        minWidth: '280px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    }));

    const edges: Edge[] = milestones.flatMap(milestone =>
      milestone.prerequisites.map(prereq => ({
        id: `${prereq}-${milestone.id}`,
        source: prereq,
        target: milestone.id,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#3498db',
          strokeWidth: 2,
          strokeDasharray: '8 5',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#3498db',
        },
      }))
    );

    return { nodes, edges };
  };

  
const apiKeys = import.meta.env.VITE_GEMINI_API_KEY?.split(',').map((key: string)=> key.trim());
const randomApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

const genAI = new GoogleGenerativeAI(randomApiKey);

  
  // Modified to prevent regeneration on revisit
  useEffect(() => {
    const generateLearningPath = async () => {
      // Only generate if we don't have a learning path and haven't generated one yet
      if (learningPath && !roadmapGenerated) {
        try {
          // Parse existing learning path and create roadmap elements
          const existingMilestones = JSON.parse(learningPath);
          const elements = createRoadmapElements(existingMilestones);
          setRoadmapElements(elements);
          setRoadmapGenerated(true);
          return;
        } catch (error) {
          console.error('Error parsing existing learning path:', error);
        }
      }

      if (!learningPath && !isGeneratingRoadmap) {
        setIsGeneratingRoadmap(true);
        try {
          const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
          const prompt = `Create a learning path for ${selectedTopic?.name} at ${skillLevel} level. The user scored ${percentage}% on the assessment. Return a JSON array of learning milestones. Each milestone should have these properties:
          {
            "id": "unique-string",
            "title": "short title",
            "description": "brief description",
            "duration": "estimated time",
            "prerequisites": ["array-of-previous-milestone-ids"]
          }`;
          
          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          const jsonMatch = text.match(/\[[\s\S]*\]/);
          if (!jsonMatch) throw new Error('Invalid response format');

          const milestones = JSON.parse(jsonMatch[0]);
          const elements = createRoadmapElements(milestones);

          setRoadmapElements(elements);
          setLearningPath(JSON.stringify(milestones, null, 2));
          setRoadmapGenerated(true);
          setError(null);
        } catch (error) {
          console.error('Error generating learning path:', error);
          const elements = createRoadmapElements(DEFAULT_MILESTONES);
          setRoadmapElements(elements);
          setLearningPath(JSON.stringify(DEFAULT_MILESTONES, null, 2));
          setRoadmapGenerated(true);
          setError('Could not generate custom learning path. Showing default roadmap.');
        } finally {
          setIsGeneratingRoadmap(false);
        }
      }
    };

    generateLearningPath();
    
    // Only generate explanations once
    if (questions.length > 0 && Object.keys(explanations).length === 0) {
      generateExplanations();
    }
  }, [selectedTopic, skillLevel, learningPath, roadmapGenerated]);

  const { user } = useUser();
  const firstName = user?.firstName;

  // Modified saveCourse function with duplicate checking
  const saveCourse = async () => {
    if (selectedTopic && skillLevel) {
      const username = firstName;
      
      try {
        // Check for duplicates before saving
        const duplicateCheckResp = await fetch(`http://localhost:5000/api/courses/get-courses/${username}`);
        if (duplicateCheckResp.ok) {
          const courses = await duplicateCheckResp.json();
          const duplicate = courses.some(course => 
            course.courseName === selectedTopic.name && course.skillLevel === skillLevel
          );
          if (duplicate) {
            alert('Course with this name and proficiency level already saved.');
            return;
          }
        }
      } catch (error) {
        // If duplicate check fails, proceed to save (network issues, etc.)
        console.warn('Failed to check duplicates:', error);
      }

      const courseData = {
        username,
        courseName: selectedTopic.name,
        skillLevel,
        roadmap: learningPath || '[]',
      };

      try {
        const response = await fetch('http://localhost:5000/api/courses/save-course', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courseData),
        });

        if (response.ok) {
          alert('Course saved successfully!');
        } else {
          const data = await response.json();
          alert(`Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error saving course:', error);
        alert('Failed to save course.');
      }
    }
  };

  // Function to regenerate roadmap manually
  const regenerateRoadmap = async () => {
    setIsGeneratingRoadmap(true);
    setRoadmapGenerated(false);
    setLearningPath(null);
    setRoadmapElements({ nodes: [], edges: [] });
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .glass {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Your Learning Journey
            </h1>
            <div className="relative inline-flex items-center justify-center w-40 h-40 mb-6">
              {/* Animated background circles */}
              <div className="absolute w-40 h-40 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-pulse opacity-20"></div>
              <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 animate-ping opacity-30"></div>
              
              {/* Score display */}
              <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                <span className="text-3xl font-bold text-white drop-shadow-lg">
                  {percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            
            {/* Stats with icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-xl text-white">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-semibold">{score} Correct</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4 rounded-xl text-white">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">📝</span>
                  <span className="font-semibold">{attemptedQuestions.length} Attempted</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-400 to-red-500 p-4 rounded-xl text-white">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">📚</span>
                  <span className="font-semibold">{questions.length} Total</span>
                </div>
              </div>
            </div>
            
            {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
          </div>

          {/* Question Review Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                📋 Question Review
              </h2>
              <button
                onClick={() => setShowReview(!showReview)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  showReview 
                    ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg' 
                    : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg'
                }`}
              >
                {showReview ? '👁️ Hide Review' : '👀 Show Review'}
              </button>
            </div>
            
            {showReview && (
              <div className="space-y-6 animate-fadeIn">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers.find(answer => answer.questionId === question.id);
                  const isAttempted = userAnswer !== undefined;
                  const isCorrect = isAttempted && userAnswer.answer === question.correctAnswer;
                  
                  return (
                    <div key={question.id} className={`
                      border-2 rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl
                      ${!isAttempted ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300' :
                        isCorrect ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-green-100' : 
                        'bg-gradient-to-r from-red-50 to-pink-50 border-red-300 shadow-red-100'
                      }
                    `}>
                      <div className="flex items-start gap-4 mb-4">
                        {/* Question number with fun styling */}
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg
                          ${!isAttempted ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                            isCorrect ? 'bg-gradient-to-r from-green-400 to-emerald-600' : 
                            'bg-gradient-to-r from-red-400 to-pink-600'
                          }
                        `}>
                          {index + 1}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4 leading-relaxed">
                            {question.text}
                          </h3>
                          
                          {/* Options with enhanced styling */}
                          <div className="space-y-3 mb-6">
                            {question.options.map((option, optionIndex) => {
                              const isUserChoice = isAttempted && userAnswer.answer === optionIndex;
                              const isCorrectOption = optionIndex === question.correctAnswer;
                              
                              return (
                                <div key={optionIndex} className={`
                                  p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                                  ${isCorrectOption ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400 shadow-green-100' :
                                    isUserChoice && !isCorrectOption ? 'bg-gradient-to-r from-red-100 to-pink-100 border-red-400 shadow-red-100' :
                                    'bg-white border-gray-300 hover:border-gray-400'
                                  }
                                `}>
                                  <div className="flex items-center gap-3">
                                    {/* Option icons */}
                                    <div className={`
                                      w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                      ${isCorrectOption ? 'bg-green-500 text-white' :
                                        isUserChoice && !isCorrectOption ? 'bg-red-500 text-white' :
                                        'bg-gray-200 text-gray-600'
                                      }
                                    `}>
                                      {String.fromCharCode(65 + optionIndex)}
                                    </div>
                                    
                                    <span className="flex-1 font-medium">{option}</span>
                                    
                                    {/* Status indicators */}
                                    {isCorrectOption && (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-sm font-semibold">✅ Correct</span>
                                      </div>
                                    )}
                                    {isUserChoice && !isCorrectOption && (
                                      <div className="flex items-center gap-1 text-red-600">
                                        <XCircle className="w-5 h-5" />
                                        <span className="text-sm font-semibold">❌ Your Choice</span>
                                      </div>
                                    )}
                                    {isUserChoice && isCorrectOption && (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <span className="text-sm font-semibold">🎯 Your Correct Answer</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Explanation section with better styling */}
                          {explanations[question.id] && (
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-5 shadow-inner">
                              <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                                <span className="text-xl">💡</span>
                                Explanation:
                              </h4>
                              <p className="text-blue-700 leading-relaxed">{explanations[question.id]}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                <span className="text-4xl">🗺️</span>
                Your Personalized Roadmap
              </h2>
              <button
                onClick={regenerateRoadmap}
                disabled={isGeneratingRoadmap}
                className="px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-full hover:from-orange-500 hover:to-red-600 transition-all duration-300 disabled:opacity-50 transform hover:scale-105 shadow-lg font-semibold"
              >
                {isGeneratingRoadmap ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Regenerating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <RefreshCcw className="w-5 h-5" />
                    🔄 Regenerate Roadmap
                  </span>
                )}
              </button>
            </div>
            
            {roadmapElements.nodes.length > 0 && !isGeneratingRoadmap ? (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-inner border border-purple-200">
                <RoadmapView nodes={roadmapElements.nodes} edges={roadmapElements.edges} />
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                <div className="relative inline-block mb-6">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                  <div className="absolute inset-0 rounded-full bg-blue-100 opacity-20 animate-pulse"></div>
                </div>
                <p className="text-gray-700 text-lg font-medium">
                  {isGeneratingRoadmap ? '🚀 Generating your personalized learning path...' : '⏳ Loading roadmap...'}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => {
                const element = document.querySelector('.react-flow') as HTMLElement;
                if (element) {
                  toPng(element, { backgroundColor: '#fff' }).then((dataUrl) => {
                    const link = document.createElement('a');
                    link.download = 'roadmap.png';
                    link.href = dataUrl;
                    link.click();
                  });
                }
              }}
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold"
            >
              <span className="flex items-center justify-center gap-3">
                <Download className="w-6 h-6 group-hover:animate-bounce" />
                <span className="text-lg">📥 Download Roadmap</span>
              </span>
            </button>
            
            <button 
              onClick={reset} 
              className="group px-8 py-4 bg-gradient-to-r from-gray-400 to-gray-600 text-white rounded-2xl hover:from-gray-500 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold"
            >
              <span className="flex items-center justify-center gap-3">
                <RefreshCcw className="w-6 h-6 group-hover:animate-spin" />
                <span className="text-lg">🔄 Start Over</span>
              </span>
            </button>
            
            <button
              onClick={saveCourse}
              className="group px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl font-semibold"
            >
              <span className="flex items-center justify-center gap-3">
                <span className="text-xl group-hover:animate-pulse">💾</span>
                <span className="text-lg">Save Course</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
