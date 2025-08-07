import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Stat {
  value: string | number;
  label: string;
  icon: string;
  suffix?: string;
  color: string;
}

const Stats: React.FC = () => {
  const [counters, setCounters] = useState({
    students: 0,
    courses: 0,
    feedbacks: 0
  });

  const stats: Stat[] = [
    {
      value: counters.students,
      label: "Students Helped",
      icon: "👨‍🎓",
      suffix: "k+",
      color: "from-purple-500 to-pink-500"
    },
    {
      value: counters.courses,
      label: "Courses Available",
      icon: "📚", 
      suffix: "+",
      color: "from-blue-500 to-cyan-500"
    },
    {
      value: counters.feedbacks,
      label: "Positive Feedbacks",
      icon: "⭐",
      suffix: "%",
      color: "from-green-500 to-teal-500"
    }
  ];

  useEffect(() => {
    const targets = { students: 500, courses: 50, feedbacks: 95 };
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepTime = duration / steps;

    const intervals = Object.keys(targets).map(key => {
      const target = targets[key as keyof typeof targets];
      const increment = target / steps;
      let current = 0;
      
      return setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(intervals[Object.keys(targets).indexOf(key)]);
        }
        setCounters(prev => ({ ...prev, [key]: Math.floor(current) }));
      }, stepTime);
    });

    return () => intervals.forEach(clearInterval);
  }, []);

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 via-white to-purple-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Our{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI-powered
            </span>{' '}
            learning platform.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            <span className="font-semibold text-purple-600">Personalized</span> education 
            that adapts to every student's unique learning journey.
          </p>
          <div className="flex justify-center mt-8">
            <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100
              }}
              className="group relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-transparent transform hover:-translate-y-2">
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    {stat.icon}
                  </div>
                  
                  {/* Number */}
                  <div className="mb-4">
                    <span className={`text-5xl md:text-6xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  
                  {/* Label */}
                  <h3 className="text-xl font-semibold text-gray-700 group-hover:text-gray-800 transition-colors duration-300">
                    {stat.label}
                  </h3>
                  
                  {/* Decorative Line */}
                  <div className={`mt-4 h-1 w-16 bg-gradient-to-r ${stat.color} mx-auto rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500`}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16 bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto border border-gray-100"
        >
          <p className="text-lg text-gray-600 leading-relaxed">
            <span className="font-semibold text-purple-600">Learno</span> has helped{' '}
            <span className="font-bold text-gray-800">half a million students</span> achieve their learning goals.
            Users love the <span className="font-semibold text-green-600">personalized learning experience</span>{' '}
            Learno provides with our wide range of courses tailored to various learning needs.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Stats;
