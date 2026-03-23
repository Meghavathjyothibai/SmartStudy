import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiChevronLeft, FiChevronRight, FiQuote } from 'react-icons/fi'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Medical Student',
      avatar: 'https://i.pravatar.cc/150?img=1',
      content: 'This study scheduler transformed how I prepare for exams. The smart algorithm helped me focus on weak areas and improved my grades significantly.',
      rating: 5,
      achievement: 'Improved GPA from 3.2 to 3.8'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Engineering Student',
      avatar: 'https://i.pravatar.cc/150?img=2',
      content: 'The time management features are incredible. I used to struggle with balancing multiple subjects, but now I have a clear plan every day.',
      rating: 5,
      achievement: 'Completed 150+ tasks in 30 days'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Law Student',
      avatar: 'https://i.pravatar.cc/150?img=3',
      content: 'The analytics dashboard gave me insights I never had before. I could see exactly where I was spending time and adjust accordingly.',
      rating: 5,
      achievement: 'Increased study efficiency by 40%'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Computer Science',
      avatar: 'https://i.pravatar.cc/150?img=4',
      content: 'The study group feature helped me collaborate with classmates. We share resources and keep each other accountable.',
      rating: 5,
      achievement: 'Led study group of 12 students'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      role: 'PhD Candidate',
      avatar: 'https://i.pravatar.cc/150?img=5',
      content: 'As a researcher, I have to read hundreds of papers. This tool helps me schedule and track my reading progress effectively.',
      rating: 5,
      achievement: 'Completed literature review in 2 months'
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Loved by{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Students Worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students who have transformed their study habits and achieved their goals.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <FiQuote className="absolute -top-6 left-0 w-16 h-16 text-indigo-200 opacity-50" />

          {/* Main Testimonial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-indigo-100">
                    <img 
                      src={testimonials[currentIndex].avatar} 
                      alt={testimonials[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Rating */}
                  <div className="flex justify-center md:justify-start space-x-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <FiStar key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-lg md:text-xl text-gray-700 italic mb-6">
                    "{testimonials[currentIndex].content}"
                  </p>

                  {/* Author Info */}
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-indigo-600 mb-2">{testimonials[currentIndex].role}</p>
                    <span className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
                      🏆 {testimonials[currentIndex].achievement}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-50 transition-colors"
          >
            <FiChevronLeft className="w-6 h-6 text-indigo-600" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-50 transition-colors"
          >
            <FiChevronRight className="w-6 h-6 text-indigo-600" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'w-8 bg-indigo-600' 
                    : 'bg-gray-300 hover:bg-indigo-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 mb-6">Trusted by students from</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            <span className="text-xl font-bold text-gray-400">Harvard</span>
            <span className="text-xl font-bold text-gray-400">Stanford</span>
            <span className="text-xl font-bold text-gray-400">MIT</span>
            <span className="text-xl font-bold text-gray-400">Cambridge</span>
            <span className="text-xl font-bold text-gray-400">Oxford</span>
            <span className="text-xl font-bold text-gray-400">IIT</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Testimonials