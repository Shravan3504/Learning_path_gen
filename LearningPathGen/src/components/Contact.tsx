
const Contact = () => {
    return (
        <>
            {/* Hero Section */}
            <div className="flex items-center justify-center h-[70vh] bg-cover bg-center text-white px-6"
                style={{ backgroundImage: `linear-gradient(rgba(0, 0, 50, 0.5), rgba(0, 0, 50, 0.5)), url('https://res.cloudinary.com/dtnvkccyy/image/upload/v1726338311/Designer_1_vkllhy.jpg')` }}>
                <div className="text-center max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Get in Touch with Learno</h1>
                    <p className="text-lg md:text-xl leading-relaxed">
                        We're here to help you with any questions or support you need. Reach out to us and let's ensure your learning journey is smooth and successful.
                    </p>
                </div>
            </div>

            {/* Support Section */}
            <div className="bg-white py-12 px-6">
                <div className="container mx-auto">
                    <div className="flex flex-wrap items-center gap-8">
                        <div className="flex-1 space-y-4">
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">Contact Our Support Team</h1>
                            <p className="text-lg text-gray-600">
                                Our team is ready to assist you with any inquiries or support you need regarding your learning experience with Learno.
                            </p>
                        </div>
                        <div className="flex-1 flex justify-center">
                            <img
                                className="rounded-lg max-w-xs md:max-w-md"
                                src="https://res.cloudinary.com/dtnvkccyy/image/upload/v1726338494/customer-care-1_cnyqwn.jpg"
                                alt="Support team member with a headset"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Our timings</h3>
                            <p className="text-gray-600">Monday-Friday 9:00 am to 4:30 pm</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Email</h3>
                            <p className="text-gray-600">ContactLearno@gmail.com</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">Our Address</h3>
                            <p className="text-gray-600">KMIT</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 uppercase mb-2">for contact the supporting team</h3>
                            <p className="text-gray-600">+91 9876788766  /  +91 8796572345</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="flex flex-col items-center py-12 px-6 bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between max-w-5xl w-full gap-8">
                    <a href="https://www.google.com/maps/" target="_blank" rel="noopener noreferrer">
                        <img
                            src="https://res.cloudinary.com/dtnvkccyy/image/upload/v1726338927/Designer_2_ppe9wi.jpg"
                            alt="Map showing the location of Learno Headquarters"
                            className="rounded-lg max-w-full"
                            width={400}
                            height={400}
                        />
                    </a>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Find Us Here</h1>
                        <p className="text-lg text-gray-600 mb-4">
                            Visit our headquarters located in the heart of the city. We welcome you to explore our innovative learning space.
                        </p>
                        <a href="https://www.google.com/maps/" className="text-blue-600 flex items-center space-x-2">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Learno Headquarters</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-100 py-12 px-6">
                <div className="container mx-auto">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">What is Learno?</h2>
                            <p className="text-gray-600">Learno is an AI-driven learning platform that adjusts the learning flow in real-time to ensure mastery of concepts.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">How can I contact support?</h2>
                            <p className="text-gray-600">You can reach our support team through the contact form on this page or by calling the provided phone numbers.</p>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">What are the office hours?</h2>
                            <p className="text-gray-600">Our office hours are Monday to Friday, 8:00 am to 5:00 pm for the USA office and 9:00 am to 6:00 pm for the Canada office.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
