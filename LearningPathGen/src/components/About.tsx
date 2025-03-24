import React from 'react';

const About: React.FC = () => {
  const courseNames = [
    'React.js', 'Python Programming', 'Machine Learning', 'AWS Cloud Computing', 
    'Node.js', 'Kubernetes', 'Docker', 'Data Science', 'Web3 Development', 
    'Cybersecurity', 'Flutter Development', 'TypeScript', 'HTML & CSS', 
    'Java Programming', 'Django Framework', 'Swift Programming', 'Rust Programming', 
    'Go (Golang)', 'GraphQL', 'SQL', 'DevOps Essentials', 'PHP Development', 
    'SEO Fundamentals', 'Excel for Data Analysis', 'Unity Game Development', 
    'React Native', 'C# Programming', 'Artificial Intelligence', 'Excel VBA Programming', 
    'Advanced Cybersecurity', 'Digital Marketing', 'Power BI', 'Blockchain Development', 
    'Microsoft Azure', 'R Programming', 'Game Design Fundamentals', 'Ethical Hacking', 
    'SAP Essentials', 'Project Management', 'Cloud Computing Fundamentals', 
    'React with Redux', 'Bootstrap Framework', 'TensorFlow', 'Linux Administration', 
    'Firebase', 'C Programming', 'C++ Programming', 'Perl Programming', 
    'Scala Programming', 'Kotlin Programming', 'Dart Programming', 'Shell Scripting', 
    'Ruby Programming', 'Fortran Programming', 'MATLAB Programming', 'SAS Programming', 
    'Bash Scripting', 'Visual Basic', 'Ruby on Rails', 'Assembly Language', 
    'Groovy Programming', 'Haskell Programming', 'Pascal Programming', 'ABAP Programming', 
    'F# Programming'
  ];

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">About Us</h1>
      <p className="text-gray-700 text-center max-w-2xl mb-8">
        Welcome to My App! Our mission is to provide an exceptional learning experience to help 
        users enhance their skills. Whether you're exploring new topics or diving deeper into 
        advanced concepts, we're here to support your journey.
      </p>
      <h2 className="text-2xl font-semibold mb-4 text-center">Available courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {courseNames.map((course, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-4 flex items-center justify-center text-center 
            text-gray-800 font-medium hover:shadow-2xl transition-shadow duration-200"
          >
            {course}
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
