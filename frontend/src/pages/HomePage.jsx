import React from 'react'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import Testimonials from '../components/landing/Testimonials'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar, FiUsers, FiAward } from 'react-icons/fi'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full opacity-10 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full opacity-10 animate-pulse delay-1000" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Study Smarter,
                <span className="block text-yellow-300">Not Harder</span>
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Transform your study habits with AI-powered scheduling, smart analytics, 
                and personalized learning plans.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 group"
                >
                  <span>Get Started Free</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/demo"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all"
                >
                  Watch Demo
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-6 mt-12">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/40?img=${i}`}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white"
                    />
                  ))}
                </div>
                <div className="text-white">
                  <div className="flex items-center space-x-1">
                    <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <FiStar className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-sm">Trusted by 50,000+ students</p>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <div className="bg-white rounded-xl p-4 shadow-2xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-indigo-100 rounded w-3/4" />
                    <div className="h-4 bg-indigo-100 rounded w-1/2" />
                    <div className="h-4 bg-indigo-100 rounded w-5/6" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="h-20 bg-indigo-50 rounded-lg" />
                    <div className="h-20 bg-indigo-50 rounded-lg" />
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white rounded-lg shadow-xl p-3"
              >
                <FiUsers className="w-6 h-6 text-indigo-600" />
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-3"
              >
                <FiAward className="w-6 h-6 text-purple-600" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Study Habits?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already studying smarter with StudySmart.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-opacity-90 transition-all group"
            >
              <span>Get Started Now</span>
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HomePage