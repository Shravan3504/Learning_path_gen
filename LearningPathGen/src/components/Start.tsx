import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, SignInButton } from '@clerk/clerk-react';

const Start: React.FC = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  const handleNavigation = (page: 'learn' | 'about') => {
    if (page === 'learn') {
      // Check if user is signed in before navigating to learn page
      if (isSignedIn) {
        navigate('/learn');
      } else {
        // If not signed in, you can either redirect to sign-in or show sign-in modal
        // Option 1: Navigate to sign-in page
        navigate('/sign-in');
        
        // Option 2: You can also trigger Clerk's sign-in modal here if preferred
        // The SignInButton component will handle this automatically
      }
    } else if (page === 'about') {
      // About page doesn't require authentication
      navigate('/about');
    }
  };

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className="hero-section bg-cover bg-center h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dtnvkccyy/image/upload/v1726215192/f07f30d5-6ad9-44e0-9b12-f50306276310_lsk3li.jpg')`,
      }}
    >
      {/* Dark Overlay for Better Text Contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500 rounded-full opacity-10 animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500 rounded-full opacity-10 animate-float-medium"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-pink-500 rounded-full opacity-10 animate-float-fast"></div>
        <div className="absolute bottom-20 right-16 w-12 h-12 bg-cyan-500 rounded-full opacity-10 animate-float-slow"></div>
      </div>

      <div className="container h-full flex items-center justify-center px-4 sm:px-8 relative z-10">
        <div className="content-box text-center max-w-lg md:max-w-2xl bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/20 animate-slide-up">
          {/* Decorative Top Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-full mb-4 shadow-lg">
            <span className="animate-pulse mr-2">✨</span>
            Tailored Learning Paths for Every Student
          </div>
          
          {/* Main Heading with Gradient Text */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
            Revolutionize Your Learning Experience with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              AI
            </span>
          </h1>
          
          {/* Enhanced Description */}
          <p className="text-gray-700 mt-4 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            <span className="font-semibold text-blue-600">Learno</span> leverages cutting-edge AI to continuously assess and adapt to each student's unique learning style, ensuring{' '}
            <span className="font-semibold text-purple-600">real-time mastery</span> of concepts. Say goodbye to traditional exams and hello to{' '}
            <span className="font-semibold text-pink-600">personalized learning</span>.
          </p>
          
          {/* Enhanced Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {/* Get Started Button - Shows different content based on auth status */}
            {isSignedIn ? (
              <button
                onClick={() => handleNavigation('learn')}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-sm sm:text-base font-semibold flex items-center justify-center relative"
              >
                <span className="mr-2">🚀</span>
                Get Started
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            ) : (
              <SignInButton mode="modal">
                <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300 text-sm sm:text-base font-semibold flex items-center justify-center relative">
                  <span className="mr-2">🔐</span>
                  Sign In to Start Learning
                  <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </button>
              </SignInButton>
            )}
            
            <button
              onClick={() => handleNavigation('about')}
              className="group text-gray-800 hover:text-blue-600 border-2 border-gray-300 hover:border-blue-600 py-3 px-8 rounded-full transition-all duration-300 text-sm sm:text-base font-semibold flex items-center justify-center bg-white/80 hover:bg-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
            >
              Learn More
              <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* User Status Indicator */}
          {isSignedIn && (
            <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              You're signed in and ready to learn!
            </div>
          )}
          
          {/* Decorative Bottom Elements */}
          <div className="mt-8 flex justify-center space-x-8 opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">500k+</div>
              <div className="text-xs text-gray-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <div className="text-xs text-gray-600">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">95%</div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-8deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-25deg); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Start;
