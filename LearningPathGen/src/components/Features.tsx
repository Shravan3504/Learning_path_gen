import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: "🧠",
      title: "AI-Driven Assessment",
      description: "The AI continuously measures student proficiency through tests or quiz.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "🎯",
      title: "Real-Time Adaptation",
      description: "Learno identifies student needs in real-time, adjusting the learning flow to ensure mastery of concepts.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: "✨",
      title: "Personalized Experience",
      description: "Our platform adapts to individual learning styles, advancing, remediating, or redirecting students as needed.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: "⚡",
      title: "Instant Feedback",
      description: "Learno provides immediate feedback, helping students to understand and correct mistakes quickly.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Discover how our{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-driven platform
            </span>{' '}
            transforms learning.
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 hover:border-transparent overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
