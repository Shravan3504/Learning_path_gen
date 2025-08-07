import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ChevronRight } from 'lucide-react';

export const Quiz = () => {
  const { questions, addAnswer, nextStep, currentStep } = useStore();
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});

  const totalQuestions = questions.length;

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    console.log('Submit clicked, current step:', currentStep);
    console.log('Selected answers:', selectedAnswers);
    
    // Add all answers to the store
    questions.forEach((question) => {
      if (selectedAnswers[question.id] !== undefined) {
        addAnswer({
          questionId: question.id,
          answer: selectedAnswers[question.id],
        });
      }
    });
    
    console.log('Answers added, calling nextStep...');
    
    // Move to next step (results page)
    nextStep();
    
    console.log('nextStep called, new step should be:', currentStep + 1);
  };

  const answeredQuestions = Object.keys(selectedAnswers).length;
  const allQuestionsAnswered = answeredQuestions === totalQuestions;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500">
            {answeredQuestions} of {totalQuestions} questions answered
          </span>
          <div className="w-32 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Questions</h1>
        <p className="text-gray-600">Please answer all questions below and submit when complete.</p>
      </div>

      {/* All Questions */}
      <div className="space-y-8">
        {questions.map((question, questionIndex) => (
          <div 
            key={question.id} 
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          >
            {/* Question Header */}
            <div className="mb-4">
              <span className="text-sm font-medium text-blue-600 mb-2 block">
                Question {questionIndex + 1}
              </span>
              <h2 className="text-xl font-semibold text-gray-800">
                {question.text}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswerSelect(question.id, optionIndex)}
                  className={`w-full p-4 text-left rounded-lg border transition-colors duration-200 ${
                    selectedAnswers[question.id] === optionIndex
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[question.id] === optionIndex
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {selectedAnswers[question.id] === optionIndex && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Question Status */}
            <div className="mt-4">
              {selectedAnswers[question.id] !== undefined ? (
                <span className="text-sm text-green-600 font-medium">
                  ✓ Answered
                </span>
              ) : (
                <span className="text-sm text-gray-400">
                  Not answered yet
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="mt-8 flex flex-col items-center">
        {!allQuestionsAnswered && (
          <p className="text-sm text-amber-600 mb-4">
            Please answer all questions before submitting
          </p>
        )}
        <button
          onClick={handleSubmit}
          disabled={!allQuestionsAnswered}
          className={`px-8 py-3 rounded-lg flex items-center justify-center space-x-2 font-medium transition-colors duration-200 ${
            allQuestionsAnswered
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Submit Quiz</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Summary */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Progress: {answeredQuestions}/{totalQuestions} questions completed
        </p>
      </div>
    </div>
  );
};
