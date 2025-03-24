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
  { id: '1', text: 'Which of these is not a programming paradigm?', options: ['Object-oriented programming', 'Functional programming', 'Visual programming', 'Sequential programming'], correctAnswer: 'Sequential programming' },
  { id: '2', text: 'What is the primary purpose of version control systems?', options: ['To track changes in source code', 'To compile code faster', 'To debug applications', 'To deploy applications'], correctAnswer: 'To track changes in source code' },
  { id: '3', text: 'What is the purpose of a constructor in OOP?', options: ['To destroy objects', 'To initialize object properties', 'To define class methods', 'To handle exceptions'], correctAnswer: 'To initialize object properties' },
  { id: '4', text: 'Which data structure follows the LIFO principle?', options: ['Queue', 'Stack', 'Array', 'Linked List'], correctAnswer: 'Stack' },
  { id: '5', text: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correctAnswer: 'O(log n)' }
];

function App() {
  const { currentStep, setQuestions, setCurrentStep } = useStore();
  const { isSignedIn, user } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuestions(sampleQuestions);
  }, [setQuestions]);

  useEffect(() => {
    if (location.pathname === '/learn' && currentStep === 0) {
      setCurrentStep(0);
    }
  }, [location.pathname, currentStep, setCurrentStep]);

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
  };

  const renderLearnContent = () => {
    if (!isSignedIn) return <RedirectToSignIn />;
    switch (currentStep) {
      case 0: return <TopicSelection />;
      case 1: return <SkillLevel />;
      case 2:
      case 3:
      case 4:
      case 5:
      case 6: return <Quiz />;
      case 7: return <Results />;
      default: return <TopicSelection />;
    }
  };

  const closeDropdown = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setDropdownVisible(false), 30);
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownVisible(true);
  };

  useEffect(() => {
    document.addEventListener('click', closeDropdown);
    return () => document.removeEventListener('click', closeDropdown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm fixed w-full z-10">
        <div className="flex justify-between items-center px-4 py-3">
          <a href="/" className="flex items-center">
            <img src="https://res.cloudinary.com/dtnvkccyy/image/upload/v1726322884/1725822757095_o2gvod.png" alt="Logo" className="h-8 mr-2" />
            <span className="text-lg font-semibold">Learno</span>
          </a>

          <div className="hidden md:flex md:space-x-8 md:items-center mx-auto">
            <button onClick={() => handleNavigation('/')} className="text-gray-600 hover:text-gray-900">Home</button>
            <button onClick={() => handleNavigation('/learn')} className="text-gray-600 hover:text-gray-900">Learn</button>
            <button onClick={() => handleNavigation('/contact')} className="text-gray-600 hover:text-gray-900">Contact</button>
            <button onClick={() => handleNavigation('/about')} className="text-gray-600 hover:text-gray-900">About</button>
          </div>

          <div className="relative md:hidden">
            {isSignedIn ? (
              <div className="relative flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={closeDropdown}>
                <img src="/assets/logo.png" alt="Profile Logo" className="w-10 h-10 rounded-full cursor-pointer border border-gray-300" 
                     onClick={() => setSidebarVisible(true)} />
              </div>
            ) : (
              <button onClick={() => handleNavigation('/learn')} className="text-gray-600 hover:text-gray-900">Login</button>
            )}
          </div>

          <div className="hidden md:flex md:items-center">
            {isSignedIn ? (
              <div className="relative flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={closeDropdown}>
                <div className="flex items-center space-x-2">
                  <span className="text-lg truncate max-w-xs">Hello {user.firstName}!</span>
                  <img src="/assets/logo.png" alt="Profile Logo" className="w-12 h-12 rounded-full cursor-pointer border border-gray-300" />
                </div>
                {dropdownVisible && (
                  <div ref={dropdownRef} className="absolute right-0 top-12 bg-white border border-gray-200 rounded-md shadow-lg z-20 w-48">
                    <button onClick={() => handleNavigation('/courses')} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">My Courses</button>
                    <button onClick={handleLogout} className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => handleNavigation('/learn')} className="text-gray-600 hover:text-gray-900">Login</button>
            )}
          </div>
        </div>
      </nav>

      {sidebarVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-20 md:hidden" onClick={() => setSidebarVisible(false)}>
          <div className="w-64 bg-white h-full p-4 shadow-lg relative">
            <button className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl" onClick={() => setSidebarVisible(false)}>
              &times;
            </button>
            
            <div className="flex flex-col items-center mt-8 mb-6">
              <img src="/assets/logo.png" alt="Profile" className="w-24 h-24 rounded-full border-2 border-gray-300 mb-2" />
              <h2 className="text-xl font-semibold text-gray-800">Hello {user?.firstName}!</h2>
            </div>
            <button onClick={() => handleNavigation('/')} className="block w-full text-gray-700 px-4 py-2">Home</button>
            <button onClick={() => handleNavigation('/learn')} className="block w-full text-gray-700 px-4 py-2">Learn</button>
            <button onClick={() => handleNavigation('/courses')} className="block w-full text-gray-700 px-4 py-2">My Courses</button>
            <button onClick={() => handleNavigation('/contact')} className="block w-full text-gray-700 px-4 py-2">Contact</button>
            <button onClick={() => handleNavigation('/about')} className="block w-full text-gray-700 px-4 py-2">About</button>
            <button onClick={handleLogout} className="block w-full text-gray-700 px-4 py-2">Logout</button>
          </div>
        </div>
      )}

      <main className="pt-16 sm:pt-16">
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home navigateTo={handleNavigation} />} />
            <Route path="/learn" element={renderLearnContent()} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/courses" element={<MyCourses />} />
            <Route path="/map/:courseName" element={<MapView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;