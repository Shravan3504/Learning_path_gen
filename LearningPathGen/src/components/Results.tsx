import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Download, RefreshCcw } from 'lucide-react';
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
  const { selectedTopic, skillLevel, questions, userAnswers, learningPath, setLearningPath, reset, } = useStore();
  const [roadmapElements, setRoadmapElements] = useState<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] });
  const [error, setError] = useState<string | null>(null);

  const score = userAnswers.reduce((acc, answer) => {
    const question = questions.find(q => q.id === answer.questionId);
    return acc + (question?.correctAnswer === answer.answer ? 1 : 0);
  }, 0);

  const percentage = (score / questions.length) * 100;

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
            <button
              onClick={() => alert(`You clicked on ${milestone.title}`)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all duration-200"
            >
              Go to {milestone.title}
            </button>
          </div>
        ),
      },
      style: {
        background: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        padding: '12px',
        minWidth: '250px',
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
  const genAI = new GoogleGenerativeAI('YOUR_GOOGLE_API_TOKEN_OF_MODEL_gemini-pro');
  useEffect(() => {
    const generateLearningPath = async () => {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
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
        setError(null);
      } catch (error) {
        console.error('Error generating learning path:', error);
        const elements = createRoadmapElements(DEFAULT_MILESTONES);
        setRoadmapElements(elements);
        setLearningPath(JSON.stringify(DEFAULT_MILESTONES, null, 2));
        setError('Could not generate custom learning path. Showing default roadmap.');
      }
    };

    if (!learningPath) generateLearningPath();
  }, [selectedTopic, skillLevel, percentage]);

  const { user } = useUser();
  const firstName = user?.firstName;

  // const saveCourse = () => {
  //   if (selectedTopic && skillLevel) {
  //     const courseData = {
  //       courseName: selectedTopic.name,
  //       skillLevel,
  //       roadmap: learningPath || '[]',
  //     };
  //     setMyCourses(courseData); 
  //     alert('Course saved successfully!');
  //   }
  // };


  const saveCourse = async () => {
    if (selectedTopic && skillLevel) {
      const courseData = {
        username: firstName, 
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
  

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your Learning Journey</h1>
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-50 mb-4">
            <span className="text-3xl font-bold text-blue-600">{percentage}%</span>
          </div>
          <p className="text-gray-600">
            You answered {score} out of {questions.length} questions correctly.
          </p>
          {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Personalized Roadmap</h2>
          {roadmapElements.nodes.length > 0 ? (
            <RoadmapView nodes={roadmapElements.nodes} edges={roadmapElements.edges} />
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your personalized learning path...</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Roadmap
          </button>
          <button onClick={reset} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <RefreshCcw className="w-5 h-5 mr-2" />
            Start Over
          </button>
          <button
            onClick={saveCourse}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Save Course
          </button>
        </div>
      </div>
    </div>
  );
};
