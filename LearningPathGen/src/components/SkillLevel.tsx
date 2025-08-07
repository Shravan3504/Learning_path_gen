import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { GraduationCap, Book, Trophy } from 'lucide-react';
import type { SkillLevel as SkillLevelType } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ClipLoader } from 'react-spinners';



const apiKeys = import.meta.env.VITE_GEMINI_API_KEY?.split(',').map((key: string)=> key.trim());
const randomApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

const genAI = new GoogleGenerativeAI(randomApiKey);


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
        Generate a quiz of 10 questions for a topic "${selectedTopic?.name ?? 'default topic'}" suitable for a "${level}" level.
        instruction to be followed: no punctuation should be added in the options 
        
        IMPORTANT: Return ONLY a valid JSON array in this exact format, with no additional text, explanations, or markdown formatting:
        [
          {
            "id": "1",
            "text": "Question text here",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswer": "Correct option"
          }
        ]
      `;

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);

      const responseText = result.response.candidates?.[0]?.content?.parts?.[0]?.text;
      console.log('Raw AI Response:', responseText);

      if (!responseText) {
        throw new Error('No response received from AI model.');
      }

      // Enhanced JSON parsing function with multiple fallback strategies
      const formatGeneratedQuizData = (rawString: string) => {
        try {
          // Strategy 1: Direct JSON parsing
          let cleanedString = rawString.trim();
          
          // Remove markdown code blocks if present - PROPERLY FIXED REGEX
          cleanedString = cleanedString.replace(/```\s*/g, '');
          
          // Remove any leading/trailing non-JSON content
          const jsonStart = cleanedString.indexOf('[');
          const jsonEnd = cleanedString.lastIndexOf(']') + 1;
          
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
            cleanedString = cleanedString.substring(jsonStart, jsonEnd);
          }

          console.log('Cleaned string for parsing:', cleanedString);
          
          let parsedData;
          try {
            parsedData = JSON.parse(cleanedString);
          } catch (directParseError) {
            console.log('Direct JSON parse failed, trying with regex cleanup...');
            
            // Strategy 2: Fix common JSON issues
            let fixedString = cleanedString
              .replace(/'/g, '"') // Replace single quotes with double quotes
              .replace(/,\s*}/g, '}') // Remove trailing commas before }
              .replace(/,\s*]/g, ']') // Remove trailing commas before ]
              .replace(/(\w+):/g, '"$1":') // Add quotes around unquoted keys
              .replace(/"\s*(\d+)\s*"/g, '"$1"'); // Ensure numbers in quotes stay in quotes
            
            parsedData = JSON.parse(fixedString);
          }
          
          if (!Array.isArray(parsedData)) {
            throw new Error('Response is not an array');
          }

          // Transform the data to match your expected format
          const formattedData = parsedData.map((question: any, index: number) => {
            if (!question.id || !question.text || !question.options || !question.correctAnswer) {
              throw new Error(`Invalid question structure at index ${index}: ${JSON.stringify(question)}`);
            }

            // Ensure options is an array
            let options = question.options;
            if (typeof options === 'string') {
              // Try to parse if it's a string representation of an array
              try {
                options = JSON.parse(options);
              } catch {
                // If that fails, split by comma
                options = options.split(',').map((opt: string) => opt.trim().replace(/['"]/g, ''));
              }
            }

            // Find the index of the correct answer
            const correctAnswerIndex = options.indexOf(question.correctAnswer);
            
            if (correctAnswerIndex === -1) {
              console.warn(`Correct answer "${question.correctAnswer}" not found in options for question ${question.id}. Using first option as fallback.`);
              // Fallback: use the first option as correct answer
              return {
                id: question.id.toString(),
                text: question.text.trim(),
                options: options,
                correctAnswer: 0,
              };
            }

            return {
              id: question.id.toString(),
              text: question.text.trim(),
              options: options,
              correctAnswer: correctAnswerIndex,
            };
          });

          return formattedData;
        } catch (parseError) {
          console.error('JSON parsing error details:', parseError);
          console.error('Raw string that failed to parse:', rawString);
          throw new Error(`Failed to parse AI response as JSON: ${parseError.message}`);
        }
      };

      // Use the enhanced function to process the raw response text
      const generatedQuestions = formatGeneratedQuizData(responseText);

      if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
        throw new Error('Parsed response does not contain valid questions.');
      }

      console.log('Successfully parsed questions:', generatedQuestions);

      // Update the store with the formatted questions
      setQuestions(generatedQuestions);

      // Proceed to the next step
      nextStep();
    } catch (error) {
      console.error('Error generating questions:', error);
      // You might want to show an error message to the user here
      alert(`Failed to generate questions: ${error.message}. Please try again.`);
    } finally {
      setStatus(false);
    }
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
            disabled={status}
            className={`p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center space-y-4 border border-gray-100 hover:border-blue-500 ${
              status ? 'opacity-50 cursor-not-allowed' : ''
            }`}
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
          <p className="mr-3 ml-3">Your questions are being loaded, please wait...</p>
        </div>
      )}
    </div>
  );
};
