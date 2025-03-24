const Features = () => {
    return (
      <>
        <div className="bg-gray-100 py-12">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <p className="text-center text-lg text-gray-600">
              Discover how our AI-driven platform transforms learning.
            </p>
            <h1 className="text-center text-3xl font-bold text-gray-800 mt-4">
              Key Features of Learno
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {/* Feature 1 */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Real-Time Adjustments
                </h2>
                <p className="text-gray-600 mt-2">
                  The AI continuously measures student proficiency through tests or quiz.
                </p>
                <img
                  className="mx-auto mt-4 rounded-lg"
                  src="https://res.cloudinary.com/dtnvkccyy/image/upload/v1726318032/Designer_rsall8.jpg"
                  alt="A student using a tablet with data charts displayed on a large screen in the background"
                  width="300"
                  height="200"
                />
                <p className="text-gray-600 mt-4">
                  Learno identifies student needs in real-time, adjusting the learning flow to ensure mastery of concepts.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Personalized Learning Paths
                </h2>
                <p className="text-gray-600 mt-2">
                  Each student gets a tailored learning experience.
                </p>
                <img
                  className="mx-auto mt-4 rounded-lg"
                  src="https://res.cloudinary.com/dtnvkccyy/image/upload/v1726318412/7cd00e9c-aa8f-4cc8-9293-01415c8cad4b_bqkuaz.jpg"
                  alt="A computer screen displaying a personalized learning dashboard"
                  width="300"
                  height="200"
                />
                <p className="text-gray-600 mt-4">
                  Our platform adapts to individual learning styles, advancing, remediating, or redirecting students as needed.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Immediate Feedback
                </h2>
                <p className="text-gray-600 mt-2">
                  Students receive instant feedback on their performance.
                </p>
                <img
                  className="mx-auto mt-4 rounded-lg"
                  src="https://res.cloudinary.com/dtnvkccyy/image/upload/v1726318085/41999eb1-d59f-42e7-877f-48e2e335da20_qo0ddy.jpg"
                  alt="A student receiving feedback on their performance from a digital interface"
                  width="300"
                  height="200"
                />
                <p className="text-gray-600 mt-4">
                  Learno provides immediate feedback, helping students to understand and correct mistakes quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default Features;
  