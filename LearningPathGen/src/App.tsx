import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { TopicSelection } from './components/TopicSelection';
import { SkillLevel } from './components/SkillLevel';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import Home from './components/Home';
import Contact from './components/Contact';
import About from './components/About';
import MyCourses from './components/MyCourses';
import MapView from './components/MapView';
import { RedirectToSignIn, useClerk, useUser } from '@clerk/clerk-react';

const sampleQuestions = [
  { id: '1', text: 'Which of these is not a programming paradigm?', options: ['Object-oriented programming', 'Functional programming', 'Visual programming', 'Sequential programming'], correctAnswer: 3 },
  { id: '2', text: 'What is the primary purpose of version control systems?', options: ['To track changes in source code', 'To compile code faster', 'To debug applications', 'To deploy applications'], correctAnswer: 0 },
  { id: '3', text: 'What is the purpose of a constructor in OOP?', options: ['To destroy objects', 'To initialize object properties', 'To define class methods', 'To handle exceptions'], correctAnswer: 1 },
  { id: '4', text: 'Which data structure follows the LIFO principle?', options: ['Queue', 'Stack', 'Array', 'Linked List'], correctAnswer: 1 },
  { id: '5', text: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctAnswer: 1 },
  { id: '6', text: 'What does HTML stand for?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'], correctAnswer: 0 },
  { id: '7', text: 'Which CSS property is used to change text color?', options: ['font-color', 'text-color', 'color', 'fg-color'], correctAnswer: 2 },
  { id: '8', text: 'What is the purpose of JavaScript?', options: ['Styling web pages', 'Adding interactivity to web pages', 'Creating databases', 'Server management'], correctAnswer: 1 },
  { id: '9', text: 'Which HTTP method is used to retrieve data?', options: ['POST', 'PUT', 'GET', 'DELETE'], correctAnswer: 2 },
  { id: '10', text: 'What does API stand for?', options: ['Application Programming Interface', 'Automated Program Integration', 'Advanced Programming Implementation', 'Application Process Integration'], correctAnswer: 0 }
];

function App() {
  const { currentStep, setQuestions, setCurrentStep } = useStore();
  const { isSignedIn, user } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('/');
  const dropdownRef = useRef(null);

  useEffect(() => {
    setQuestions(sampleQuestions);
  }, [setQuestions]);

  useEffect(() => {
    if (location.pathname === '/learn' && currentStep === 0) {
      setCurrentStep(0);
    }
  }, [location.pathname, currentStep, setCurrentStep]);

  useEffect(() => {
    setActiveNavItem(location.pathname);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await clerk.signOut();
      useStore.getState().reset();
      navigate('/');
      setDropdownVisible(false);
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDropdownVisible(false);
    setSidebarVisible(false);
  };

  const renderLearnContent = () => {
    if (!isSignedIn) return <RedirectToSignIn />;

    switch (currentStep) {
      case 0: return <TopicSelection />;
      case 1: return <SkillLevel />;
      case 2: return <Quiz />;
      case 3: return <Results />;
      default: return <TopicSelection />;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/learn', label: 'Learn', icon: '📚' },
    { path: '/contact', label: 'Contact', icon: '📞' },
    { path: '/about', label: 'About', icon: 'ℹ️' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Responsive Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            
            {/* Enhanced Logo - Responsive */}
            <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('/')}>
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-lg sm:text-xl">L</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <h1 className="ml-2 sm:ml-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Learno
              </h1>
            </div>
            
            {/* Enhanced Desktop Navigation - Responsive */}
            <nav className="hidden lg:flex items-center space-x-1 bg-gray-50 rounded-full p-2 shadow-inner">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-full transition-all duration-300 text-sm xl:text-base ${
                    activeNavItem === item.path
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <span className="text-xs xl:text-sm">{item.icon}</span>
                  <span className="font-medium hidden xl:block">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Tablet Navigation - Hidden on mobile and desktop */}
            <nav className="hidden md:flex lg:hidden items-center space-x-1">
              {navItems.slice(0, 2).map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-full transition-all duration-300 text-sm ${
                    activeNavItem === item.path
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Enhanced User Menu - Responsive */}
            <div className="flex items-center">
              {isSignedIn ? (
                <>
                  {/* Desktop User Dropdown */}
                  <div className="hidden md:block relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownVisible(!dropdownVisible)}
                      className="flex items-center space-x-2 lg:space-x-3 p-1.5 lg:p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <div className="relative">
                        <img 
                          src={user.imageUrl} 
                          alt="Profile" 
                          className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-blue-200 group-hover:border-blue-400 transition-colors duration-200"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 lg:-bottom-1 lg:-right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="hidden lg:flex lg:flex-col lg:items-start">
                        <span className="text-gray-700 font-medium text-sm">Hello {user.firstName}!</span>
                      </div>
                      <svg 
                        className={`w-3 h-3 lg:w-4 lg:h-4 text-gray-400 transition-transform duration-200 ${dropdownVisible ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Enhanced Dropdown Menu - Responsive */}
                    {dropdownVisible && (
                      <div className="absolute right-0 top-full mt-2 w-56 lg:w-64 bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-100 animate-in slide-in-from-top-5 duration-200">
                        <div className="py-2">
                          <button 
                            onClick={() => handleNavigation('/courses')} 
                            className="flex items-center space-x-3 w-full px-4 py-2.5 lg:py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                          >
                            <span className="text-base lg:text-lg">📖</span>
                            <div className="flex flex-col items-start">
                              <span className="font-medium text-sm lg:text-base">My Courses</span>
                              <span className="text-xs text-gray-500">View progress</span>
                            </div>
                          </button>
                          
                          <div className="border-t border-gray-100 my-2"></div>
                          
                          <button 
                            onClick={handleLogout} 
                            className="flex items-center space-x-3 w-full px-4 py-2.5 lg:py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
                            <span className="text-base lg:text-lg">🚪</span>
                            <span className="font-medium text-sm lg:text-base">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile Menu Button */}
                  <button 
                    className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setSidebarVisible(true)}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => handleNavigation('/learn')} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Sidebar - More Responsive */}
      {sidebarVisible && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarVisible(false)}></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out">
            <div className="p-4 sm:p-6">
              <button 
                onClick={() => setSidebarVisible(false)}
                className="float-right p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="clear-both pt-4">
                {/* User Profile Section - Responsive */}
                <div className="text-center mb-6 sm:mb-8 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                  <img 
                    src={user?.imageUrl} 
                    alt="Profile" 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-2 sm:mb-3 border-4 border-white shadow-lg"
                  />
                  <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{user?.fullName}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 truncate">{user?.emailAddresses[0]?.emailAddress}</p>
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">Premium Member</span>
                </div>
                
                {/* Navigation - Responsive */}
                <nav className="space-y-1 sm:space-y-2">
                  {navItems.map((item) => (
                    <button 
                      key={item.path}
                      onClick={() => handleNavigation(item.path)} 
                      className={`flex items-center space-x-3 sm:space-x-4 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${
                        activeNavItem === item.path
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-lg sm:text-xl">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                  
                  <div className="border-t border-gray-200 my-3 sm:my-4"></div>
                  
                  <button 
                    onClick={() => handleNavigation('/courses')} 
                    className="flex items-center space-x-3 sm:space-x-4 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
                  >
                    <span className="text-lg sm:text-xl">📖</span>
                    <span className="font-medium">My Courses</span>
                  </button>
                  
                  <button 
                    onClick={() => handleNavigation('/map')} 
                    className="flex items-center space-x-3 sm:space-x-4 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
                  >
                    <span className="text-lg sm:text-xl">🗺️</span>
                    <span className="font-medium">Learning Map</span>
                  </button>
                  
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center space-x-3 sm:space-x-4 w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200 mt-3 sm:mt-4 text-sm sm:text-base"
                  >
                    <span className="text-lg sm:text-xl">🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-2 sm:px-4 lg:px-0">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/learn" element={renderLearnContent()} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<MyCourses />} />
          <Route path="/:username/:courseName" element={<MapView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
