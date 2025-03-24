import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GraduationCap, Book, Trophy } from 'lucide-react';
import type { SkillLevel as SkillLevelType } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ClipLoader } from 'react-spinners'; // Importing the spinner component

// Initialize Generative AI instance
const genAI = new GoogleGenerativeAI('YOUR_GOOGLE_API_KEY_MODEL_gemini-pro');

// Question structure
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

// Skill level configurations
const skillLevels = [
  {
    level: 'beginner',
    title: 'Beginner',
    description: 'New to the subject, learning fundamentals',
    icon: Book,
    color: 'bg-green-50 text-green-600',
  },
  {
    level: 'intermediate',
    title: 'Intermediate',
    description: 'Familiar with basics, ready for advanced concepts',
    icon: GraduationCap,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    level: 'advanced',
    title: 'Advanced',
    description: 'Experienced, seeking mastery',
    icon: Trophy,
    color: 'bg-purple-50 text-purple-600',
  },
];

export const SkillLevel: React.FC = () => {
  
  const { setSkillLevel, nextStep, setQuestions, selectedTopic } = useStore();
  const [status, setStatus] = useState<boolean>(false);

  const handleSkillSelect = async (level: SkillLevelType) => {
    setSkillLevel(level);
    setStatus(true);

    try {
      const prompt = `
        Generate a quiz of 5 questions for a topic "${selectedTopic?.name ?? 'default topic'}" suitable for a "${level}" level.
        instruction to be follwed : no punctuvation should be added in the options 
        Provide the questions in the following structure:
        [
          {
            id: '1',
            text: 'Question text here',
            options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
            correctAnswer: 'Correct option'
          },
          ...
        ]
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);

      const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(responseText);

      if (!responseText) {
        throw new Error('No response received from AI model.');
      }

      // Regex-based parsing function
      const formatGeneratedQuizData = (rawString: string) => {
        const questionRegex = /id:\s*['"](\d+)['"],\s*text:\s*['"]([^'"]+)['"],/g;
        const optionsRegex = /options:\s*\[([^\]]+)\]/g;
        const correctAnswerRegex = /correctAnswer:\s*['"]([^'"]+)['"]/g;

        const formattedData = [];
        let questionMatch, optionsMatch, correctAnswerMatch;

        // Match questions in sequence
        while (
          (questionMatch = questionRegex.exec(rawString)) &&
          (optionsMatch = optionsRegex.exec(rawString)) &&
          (correctAnswerMatch = correctAnswerRegex.exec(rawString))
        ) {
          const id = questionMatch[1];
          const text = questionMatch[2];
          const optionsRaw = optionsMatch[1];
          const correctAnswer = correctAnswerMatch[1];

          // Parse options into an array
          const options = optionsRaw
            .split(',')
            .map((opt) => opt.trim().replace(/['"]/g, ''));

          // Find the index of the correct answer
          const correctAnswerIndex = options.indexOf(correctAnswer);

          formattedData.push({
            id: id,
            text: text.trim(),
            options: options,
            correctAnswer: correctAnswerIndex,
          });
        }

        return formattedData;
      };

      // Use the regex function to process the raw response text
      const generatedQuestions = formatGeneratedQuizData(responseText);

      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error('Parsed response does not contain valid questions.');
      }

      // Update the store with the formatted questions
      setQuestions(generatedQuestions);

      // Proceed to the next step
      nextStep();
    } catch (error) {
      console.error('Error generating questions:', error);
    }
    setStatus(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        What's Your Current Skill Level?
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {skillLevels.map(({ level, title, description, icon: Icon, color }) => (
          <button
            key={level}
            onClick={() => handleSkillSelect(level as SkillLevelType)}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center space-y-4 border border-gray-100 hover:border-blue-500"
          >
            <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center`}>
              <Icon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600 text-center">{description}</p>
          </button>
        ))}
      </div>
      {status && (
        <div className="flex justify-center items-center mt-6">
          <ClipLoader size={50} color="#4A90E2" loading={status} />
          <p className='mr-3 ml-3'>  your questions being loaded please wait.....</p>
        </div>
      )}
    </div>
  );
};
