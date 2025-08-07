import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCourses, setVisibleCourses] = useState(12);
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);

  const navigate = useNavigate();

  const handleEnrollClick = (courseName: string) => {
    // Navigate to learn page with course information
    navigate('/learn', { state: { selectedCourse: courseName } });
  };


  const courseData = [
    // Frontend & Web Development
    { name: 'React.js', category: 'Frontend', difficulty: 'Intermediate', duration: '8 weeks', icon: '⚛️', color: 'from-blue-500 to-cyan-500' },
    { name: 'HTML & CSS', category: 'Frontend', difficulty: 'Beginner', duration: '4 weeks', icon: '🌐', color: 'from-orange-500 to-red-500' },
    { name: 'TypeScript', category: 'Frontend', difficulty: 'Intermediate', duration: '6 weeks', icon: '📘', color: 'from-blue-600 to-blue-800' },
    { name: 'React Native', category: 'Frontend', difficulty: 'Advanced', duration: '10 weeks', icon: '📱', color: 'from-purple-500 to-pink-500' },
    { name: 'Bootstrap Framework', category: 'Frontend', difficulty: 'Beginner', duration: '3 weeks', icon: '🎨', color: 'from-purple-600 to-blue-600' },
    { name: 'React with Redux', category: 'Frontend', difficulty: 'Advanced', duration: '12 weeks', icon: '🔄', color: 'from-indigo-500 to-purple-600' },

    // Backend & Server-side
    { name: 'Node.js', category: 'Backend', difficulty: 'Intermediate', duration: '8 weeks', icon: '🟢', color: 'from-green-500 to-emerald-500' },
    { name: 'Python Programming', category: 'Backend', difficulty: 'Beginner', duration: '10 weeks', icon: '🐍', color: 'from-yellow-500 to-green-500' },
    { name: 'Java Programming', category: 'Backend', difficulty: 'Intermediate', duration: '12 weeks', icon: '☕', color: 'from-red-600 to-orange-600' },
    { name: 'Django Framework', category: 'Backend', difficulty: 'Intermediate', duration: '10 weeks', icon: '🎯', color: 'from-green-600 to-blue-600' },
    { name: 'PHP Development', category: 'Backend', difficulty: 'Beginner', duration: '8 weeks', icon: '🐘', color: 'from-purple-500 to-indigo-500' },
    { name: 'Ruby on Rails', category: 'Backend', difficulty: 'Intermediate', duration: '10 weeks', icon: '💎', color: 'from-red-500 to-pink-500' },

    // Data Science & AI/ML
    { name: 'Machine Learning', category: 'AI/ML', difficulty: 'Advanced', duration: '16 weeks', icon: '🤖', color: 'from-cyan-500 to-blue-600' },
    { name: 'Data Science', category: 'AI/ML', difficulty: 'Intermediate', duration: '14 weeks', icon: '📊', color: 'from-teal-500 to-cyan-600' },
    { name: 'Artificial Intelligence', category: 'AI/ML', difficulty: 'Advanced', duration: '20 weeks', icon: '🧠', color: 'from-purple-600 to-indigo-700' },
    { name: 'TensorFlow', category: 'AI/ML', difficulty: 'Advanced', duration: '12 weeks', icon: '🔥', color: 'from-orange-500 to-red-600' },
    { name: 'R Programming', category: 'AI/ML', difficulty: 'Intermediate', duration: '8 weeks', icon: '📈', color: 'from-blue-500 to-teal-500' },
    { name: 'Power BI', category: 'AI/ML', difficulty: 'Beginner', duration: '6 weeks', icon: '📋', color: 'from-yellow-500 to-orange-500' },

    // Cloud & DevOps
    { name: 'AWS Cloud Computing', category: 'Cloud', difficulty: 'Intermediate', duration: '10 weeks', icon: '☁️', color: 'from-orange-400 to-yellow-500' },
    { name: 'Kubernetes', category: 'Cloud', difficulty: 'Advanced', duration: '12 weeks', icon: '⚙️', color: 'from-blue-600 to-indigo-600' },
    { name: 'Docker', category: 'Cloud', difficulty: 'Intermediate', duration: '6 weeks', icon: '🐳', color: 'from-blue-500 to-cyan-500' },
    { name: 'Microsoft Azure', category: 'Cloud', difficulty: 'Intermediate', duration: '10 weeks', icon: '🌀', color: 'from-blue-600 to-purple-600' },
    { name: 'DevOps Essentials', category: 'Cloud', difficulty: 'Intermediate', duration: '8 weeks', icon: '🔧', color: 'from-green-500 to-blue-500' },
    { name: 'Linux Administration', category: 'Cloud', difficulty: 'Intermediate', duration: '10 weeks', icon: '🐧', color: 'from-gray-700 to-blue-600' },

    // Mobile Development
    { name: 'Flutter Development', category: 'Mobile', difficulty: 'Intermediate', duration: '10 weeks', icon: '📱', color: 'from-blue-400 to-cyan-400' },
    { name: 'Swift Programming', category: 'Mobile', difficulty: 'Intermediate', duration: '12 weeks', icon: '🍎', color: 'from-gray-600 to-blue-600' },
    { name: 'Kotlin Programming', category: 'Mobile', difficulty: 'Intermediate', duration: '10 weeks', icon: '📲', color: 'from-purple-500 to-orange-500' },

    // Security
    { name: 'Cybersecurity', category: 'Security', difficulty: 'Advanced', duration: '16 weeks', icon: '🔒', color: 'from-red-600 to-gray-800' },
    { name: 'Ethical Hacking', category: 'Security', difficulty: 'Advanced', duration: '14 weeks', icon: '🎭', color: 'from-gray-800 to-red-600' },
    { name: 'Advanced Cybersecurity', category: 'Security', difficulty: 'Expert', duration: '20 weeks', icon: '🛡️', color: 'from-red-700 to-black' },

    // Other Programming Languages (condensed for space)
    { name: 'C Programming', category: 'Programming', difficulty: 'Beginner', duration: '8 weeks', icon: '🔤', color: 'from-gray-500 to-blue-500' },
    { name: 'C++ Programming', category: 'Programming', difficulty: 'Intermediate', duration: '10 weeks', icon: '➕', color: 'from-blue-600 to-purple-600' },
    { name: 'Go (Golang)', category: 'Programming', difficulty: 'Intermediate', duration: '8 weeks', icon: '🐹', color: 'from-cyan-500 to-blue-600' },
    { name: 'Rust Programming', category: 'Programming', difficulty: 'Advanced', duration: '12 weeks', icon: '🦀', color: 'from-orange-600 to-red-700' },
    
    // Other categories
    { name: 'Blockchain Development', category: 'Web3', difficulty: 'Advanced', duration: '14 weeks', icon: '⛓️', color: 'from-yellow-500 to-orange-600' },
    { name: 'Web3 Development', category: 'Web3', difficulty: 'Advanced', duration: '16 weeks', icon: '🌐', color: 'from-purple-500 to-pink-600' },
    { name: 'Unity Game Development', category: 'Gaming', difficulty: 'Intermediate', duration: '12 weeks', icon: '🎮', color: 'from-purple-600 to-blue-600' },
    { name: 'Game Design Fundamentals', category: 'Gaming', difficulty: 'Beginner', duration: '8 weeks', icon: '🕹️', color: 'from-pink-500 to-purple-600' },
  ];

  const categories = ['All', 'Frontend', 'Backend', 'AI/ML', 'Cloud', 'Mobile', 'Security', 'Programming', 'Web3', 'Gaming'];

  const filteredCourses = courseData.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const difficultyColors = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-orange-100 text-orange-800',
    'Expert': 'bg-red-100 text-red-800'
  };

  const stats = [
    { number: '60+', label: 'Courses Available', icon: '📚' },
    { number: '10K+', label: 'Students Enrolled', icon: '👨‍🎓' },
    { number: '95%', label: 'Success Rate', icon: '🎯' },
    { number: '24/7', label: 'Support Available', icon: '🛟' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="text-6xl animate-bounce">🚀</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              About Learno
            </h1>
            <p className="text-xl md:text-2xl leading-relaxed mb-8 text-gray-200">
              Empowering minds through cutting-edge technology and personalized learning experiences. 
              <br />
              <span className="font-semibold text-yellow-300">Your journey to mastery starts here!</span>
            </p>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Mission 🎯</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            At Learno, we believe that education should be accessible, engaging, and transformative. 
            Our AI-powered platform adapts to your learning style, ensuring you master every concept 
            at your own pace while building real-world skills that matter.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3">Personalized Learning</h3>
              <p className="text-gray-600">Tailored curriculum that adapts to your pace and learning style</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3">Industry-Relevant Skills</h3>
              <p className="text-gray-600">Learn technologies and frameworks used by top companies</p>
            </div>
            <div className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">Expert Support</h3>
              <p className="text-gray-600">24/7 access to mentors and a supportive learning community</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="py-16 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Explore Our Courses 📚
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose from our comprehensive collection of courses designed by industry experts 
              and updated regularly to match current market demands.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto mb-8">
              <input
                type="text"
                placeholder="Search courses... 🔍"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 rounded-full border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-center text-lg"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.slice(0, visibleCourses).map((course, index) => (
              <div
                key={index}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredCourse(index)}
                onMouseLeave={() => setHoveredCourse(null)}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className={`bg-gradient-to-br ${course.color} p-6 text-white relative`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-4xl">{course.icon}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyColors[course.difficulty]}`}>
                        {course.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{course.name}</h3>
                    <p className="text-sm opacity-90">{course.category}</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">⏱️</span>
                        <span className="text-sm font-medium text-gray-700">{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400">⭐</span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                    onClick={() => handleEnrollClick(course.name)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform group-hover:scale-105">
                      Enroll Now 🚀
                    </button>
                  </div>
                  
                  {hoveredCourse === index && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-2xl pointer-events-none"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {filteredCourses.length > visibleCourses && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCourses(prev => prev + 12)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Load More Courses 📖
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-6 bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Learning? 🎓</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-200">
            Join thousands of successful learners who have transformed their careers with Learno. 
            Your future self will thank you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
              Start Free Trial ✨
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-4 px-8 rounded-full transition-all duration-300">
              Contact Us 💬
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
