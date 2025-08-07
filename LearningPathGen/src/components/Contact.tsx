import { useState } from 'react';

const Contact = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', formData);
    };

    const contactMethods = [
        {
            icon: "🕒",
            title: "Office Hours",
            subtitle: "We're available when you need us",
            content: "Monday-Friday\n9:00 AM - 4:30 PM IST",
            color: "from-blue-500 to-purple-600"
        },
        {
            icon: "✉️",
            title: "Email Support",
            subtitle: "Drop us a message anytime",
            content: "ContactLearno@gmail.com\nResponse within 24 hours",
            color: "from-green-500 to-teal-600"
        },
        {
            icon: "📍",
            title: "Visit Us",
            subtitle: "Come say hello in person",
            content: "KMIT Campus\nHyderabad, India",
            color: "from-orange-500 to-red-600"
        },
        {
            icon: "📞",
            title: "Call Us",
            subtitle: "Speak directly with our team",
            content: "+91 9876788766\n+91 8796572345",
            color: "from-purple-500 to-pink-600"
        }
    ];

    const faqs = [
        {
            question: "What is Learno?",
            answer: "Learno is an AI-driven learning platform that personalizes your education journey, adapting in real-time to ensure you master every concept at your own pace.",
            icon: "🤖"
        },
        {
            question: "How can I contact support?",
            answer: "Multiple ways! Use our contact form, email us directly, call our support lines, or visit us in person. We're here to help however works best for you.",
            icon: "🎧"
        },
        {
            question: "What are the office hours?",
            answer: "We're available Monday to Friday, 9:00 AM to 4:30 PM IST. For urgent matters outside these hours, email us and we'll get back to you first thing!",
            icon: "⏰"
        },
        {
            question: "Do you offer technical support?",
            answer: "Absolutely! Our technical team can help with platform issues, account problems, or any learning difficulties you might encounter.",
            icon: "🛠️"
        },
        {
            question: "Can I schedule a demo?",
            answer: "Yes! Contact us to schedule a personalized demo and see how Learno can transform your learning experience.",
            icon: "🎯"
        },
        {
            question: "Is there a mobile app?",
            answer: "Our platform is fully responsive and works great on mobile browsers. A dedicated app is coming soon!",
            icon: "📱"
        }
    ];

    return (
        <>
            {/* Enhanced Hero Section */}
            <div className="relative flex items-center justify-center h-[80vh] bg-cover bg-center text-white px-6 overflow-hidden"
                style={{ backgroundImage: `linear-gradient(135deg, rgba(0, 0, 50, 0.7), rgba(50, 0, 100, 0.6)), url('https://res.cloudinary.com/dtnvkccyy/image/upload/v1726338311/Designer_1_vkllhy.jpg')` }}>
                
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-400 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
                    <div className="absolute top-1/2 left-10 w-24 h-24 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                </div>

                <div className="text-center max-w-5xl z-10">
                    <div className="mb-6">
                        <span className="inline-block text-6xl animate-bounce">👋</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                        Let's Connect!
                    </h1>
                    <p className="text-xl md:text-2xl leading-relaxed mb-8">
                        Have questions? Need support? Want to share feedback? 
                        <br />
                        <span className="font-semibold text-yellow-300">We're here to make your learning journey amazing!</span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">24/7 Support</span>
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">Quick Response</span>
                        <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm">Expert Team</span>
                    </div>
                </div>
            </div>

            {/* Enhanced Contact Methods Section */}
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-16 px-6">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
                            How Can We Help? 🚀
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Choose your preferred way to reach out. Our amazing support team is ready to assist you!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactMethods.map((method, index) => (
                            <div
                                key={index}
                                className={`relative group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                                    hoveredCard === index ? 'z-10' : ''
                                }`}
                                onMouseEnter={() => setHoveredCard(index)}
                                onMouseLeave={() => setHoveredCard(null)}
                            >
                                <div className={`bg-gradient-to-br ${method.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-300`}>
                                    <div className="text-4xl mb-4 group-hover:animate-bounce">{method.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                                    <p className="text-sm opacity-90 mb-3">{method.subtitle}</p>
                                    <p className="text-sm font-medium whitespace-pre-line">{method.content}</p>
                                </div>
                                {hoveredCard === index && (
                                    <div className="absolute -inset-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl opacity-20 animate-pulse"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contact Form Section */}
                    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl mx-auto">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-gray-800 mb-4">Send us a Message 💬</h3>
                            <p className="text-gray-600">We'd love to hear from you! Fill out the form below and we'll get back to you soon.</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Your Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows="5"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                                    placeholder="Tell us how we can help you..."
                                    required
                                ></textarea>
                            </div>
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Send Message 🚀
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Enhanced Map Section */}
            <div className="flex flex-col items-center py-16 px-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between max-w-6xl w-full gap-12">
                    <div className="lg:w-1/2">
                        <div className="relative group cursor-pointer">
                            <a href="https://www.google.com/maps/" target="_blank" rel="noopener noreferrer">
                                <img
                                    src="https://res.cloudinary.com/dtnvkccyy/image/upload/v1726338927/Designer_2_ppe9wi.jpg"
                                    alt="Interactive map showing Learno's location"
                                    className="rounded-2xl max-w-full shadow-2xl transition-transform duration-300 group-hover:scale-105"
                                    width={500}
                                    height={400}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                                    <span className="text-white font-bold text-lg">Click to open in Google Maps 🗺️</span>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <div className="mb-6">
                            <span className="text-5xl">📍</span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">Visit Our Campus!</h2>
                        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                            Come experience innovation firsthand at our state-of-the-art learning facility. 
                            We'd love to show you around and demonstrate how Learno is revolutionizing education!
                        </p>
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-center lg:justify-start space-x-3">
                                <span className="text-2xl">🏫</span>
                                <span className="text-lg font-medium">KMIT Campus, Hyderabad</span>
                            </div>
                        </div>
                        <a 
                            href="https://www.google.com/maps/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            <span>Get Directions</span>
                            <span>🧭</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Enhanced FAQ Section */}
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 py-16 px-6">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            Got Questions? We've Got Answers! 🤔
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            Find quick answers to the most common questions about Learno and our services.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
                            >
                                <div className="text-3xl mb-4">{faq.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-4">{faq.question}</h3>
                                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-gray-300 mb-6">Still have questions?</p>
                        <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                            Contact Our Support Team 🎯
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
