import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiBook, FiClock, FiTarget } from 'react-icons/fi'

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.05,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Master Your Studies with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Smart Scheduling
              </span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8">
              The intelligent study planner that adapts to your learning style. 
              Achieve more in less time with personalized study plans and real-time progress tracking.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-indigo-900 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 group"
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
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-white">50k+</div>
                <div className="text-white/70">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">1M+</div>
                <div className="text-white/70">Tasks Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">98%</div>
                <div className="text-white/70">Success Rate</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Features Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              {
                icon: FiBook,
                title: 'Smart Planning',
                desc: 'AI-powered study schedules',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: FiClock,
                title: 'Time Tracking',
                desc: 'Monitor your study hours',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: FiTarget,
                title: 'Goal Setting',
                desc: 'Achieve your targets',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: FiBook,
                title: 'Progress Analytics',
                desc: 'Detailed insights',
                color: 'from-orange-500 to-orange-600'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${feature.color} p-6 rounded-2xl backdrop-blur-lg bg-opacity-20`}
              >
                <feature.icon className="w-8 h-8 text-white mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/80">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Hero