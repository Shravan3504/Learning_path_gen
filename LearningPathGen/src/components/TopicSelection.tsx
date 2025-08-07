import { SearchBar } from './SearchBar';
import { 
  Sparkles, 
  TrendingUp, 
  Zap, 
  BookOpen,
  Code,
  Database,
  Brain,
  Palette,
  Cloud,
  Settings,
  Shield,
  Smartphone
} from 'lucide-react';

export const TopicSelection = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-purple-700 mb-4">
          <Zap className="w-4 h-4 mr-2" />
          1000+ Expert-Led Courses
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
          What Do You Want to 
          <span className="block">Learn Today?</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover your next skill, advance your career, or explore a passion with our curated collection of courses
        </p>
        
        <div className='flex justify-center '>
          <SearchBar />
        </div>
        
        <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            50,000+ Students
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            95% Success Rate
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex items-center justify-center mb-8">
          <Sparkles className="w-6 h-6 mr-3 text-yellow-500 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Trending Topics
          </h2>
          <Sparkles className="w-6 h-6 ml-3 text-yellow-500 animate-pulse" />
        </div>
        <div className="font-bold text-gray-800 flex items-center justify-center mb-8">search for courses in the search bar....</div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {popularTopics.map((topic, index) => (
            <div
              key={topic.name}
              className="group relative px-4 py-6 bg-white rounded-xl border border-gray-200 text-center hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${topic.color}`}>
                <topic.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-600">
                {topic.name}
              </h3>
              
              <p className="text-xs text-gray-500 mb-2">
                {topic.courses} courses
              </p>
              
              {topic.trending && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  🔥 Hot
                </div>
              )}
              
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500 group-hover:from-blue-600 group-hover:to-purple-600"
                  style={{ width: `${topic.popularity}%` }}
                ></div>
              </div>
              
              <span className="text-xs font-medium text-blue-600">
                {topic.level}
              </span>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
            Explore All Categories
            <Sparkles className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

const popularTopics = [
  {
    name: 'React.js',
    icon: Code,
    color: 'bg-blue-500',
    courses: '150+',
    popularity: 92,
    level: 'All Levels',
    trending: true
  },
  {
    name: 'Python',
    icon: Code,
    color: 'bg-green-500',
    courses: '200+',
    popularity: 95,
    level: 'Beginner+',
    trending: true
  },
  {
    name: 'AI & ML',
    icon: Brain,
    color: 'bg-purple-500',
    courses: '120+',
    popularity: 88,
    level: 'Intermediate',
    trending: true
  },
  {
    name: 'JavaScript',
    icon: Code,
    color: 'bg-yellow-500',
    courses: '180+',
    popularity: 90,
    level: 'All Levels',
    trending: false
  },
  {
    name: 'Data Science',
    icon: Database,
    color: 'bg-indigo-500',
    courses: '100+',
    popularity: 85,
    level: 'Advanced',
    trending: true
  },
  {
    name: 'Web Dev',
    icon: Code,
    color: 'bg-cyan-500',
    courses: '250+',
    popularity: 93,
    level: 'All Levels',
    trending: false
  },
  {
    name: 'UI/UX',
    icon: Palette,
    color: 'bg-pink-500',
    courses: '80+',
    popularity: 78,
    level: 'Creative',
    trending: false
  },
  {
    name: 'Node.js',
    icon: Code,
    color: 'bg-green-600',
    courses: '90+',
    popularity: 82,
    level: 'Intermediate',
    trending: false
  },
  {
    name: 'Cloud & AWS',
    icon: Cloud,
    color: 'bg-orange-500',
    courses: '110+',
    popularity: 87,
    level: 'Professional',
    trending: true
  },
  {
    name: 'DevOps',
    icon: Settings,
    color: 'bg-red-500',
    courses: '75+',
    popularity: 80,
    level: 'Advanced',
    trending: false
  },
  {
    name: 'Security',
    icon: Shield,
    color: 'bg-gray-700',
    courses: '60+',
    popularity: 75,
    level: 'Expert',
    trending: true
  },
  {
    name: 'Mobile Dev',
    icon: Smartphone,
    color: 'bg-blue-600',
    courses: '95+',
    popularity: 83,
    level: 'Intermediate',
    trending: false
  }
];
