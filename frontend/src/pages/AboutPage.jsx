import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiUsers, FiAward, FiHeart, FiTarget } from 'react-icons/fi'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'

const AboutPage = () => {
  const stats = [
    { icon: FiUsers, value: '50,000+', label: 'Active Users' },
    { icon: FiAward, value: '98%', label: 'Satisfaction Rate' },
    { icon: FiHeart, value: '1M+', label: 'Tasks Completed' },
    { icon: FiTarget, value: '150+', label: 'Countries' },
  ]

  const team = [
    {
      name: 'Dr. Sarah Wilson',
      role: 'Founder & CEO',
      bio: 'Former professor with PhD in Educational Technology',
      image: 'https://i.pravatar.cc/300?img=1'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Ex-Google engineer passionate about EdTech',
      image: 'https://i.pravatar.cc/300?img=2'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Product',
      bio: 'Learning experience designer with 10+ years experience',
      image: 'https://i.pravatar.cc/300?img=3'
    },
    {
      name: 'Dr. James Kumar',
      role: 'Learning Scientist',
      bio: 'Research focus on cognitive psychology and memory',
      image: 'https://i.pravatar.cc/300?img=4'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 pt-32 pb-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full opacity-10" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full opacity-10" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Our Mission: Make Learning
            <span className="block text-yellow-300">Smarter, Not Harder</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl max-w-3xl mx-auto text-white/90"
          >
            We're building the future of education with AI-powered tools that help students 
            achieve more in less time.
          </motion.p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6 text-center"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              StudySmart was born from a simple observation: students spend too much time 
              organizing their study time and not enough time actually learning.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Founded in 2020 by a team of educators and engineers, we set out to build 
              an intelligent system that removes the friction from study planning and 
              helps students focus on what really matters.
            </p>
            <p className="text-lg text-gray-600">
              Today, we're proud to help over 50,000 students across 150 countries 
              achieve their academic goals through smarter study habits.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
                alt="Team collaboration"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6">
              <p className="text-4xl font-bold text-indigo-600 mb-1">50k+</p>
              <p className="text-gray-600">Students helped</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Student First',
                description: 'Every feature we build starts with the question: "How does this help students learn better?"',
                icon: '🎓'
              },
              {
                title: 'Science-Backed',
                description: 'Our methods are based on cognitive science research and proven learning techniques.',
                icon: '🔬'
              },
              {
                title: 'Continuous Improvement',
                description: 'We never stop learning and improving our platform based on user feedback.',
                icon: '📈'
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
          <p className="text-xl text-gray-600">Passionate people building the future of education</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="relative mb-4 inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-indigo-100">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-indigo-600 mb-2">{member.role}</p>
              <p className="text-sm text-gray-600">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-4"
          >
            Ready to transform your study habits?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 mb-8"
          >
            Join thousands of students who are already studying smarter.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Get Started Free
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AboutPage