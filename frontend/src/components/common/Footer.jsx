import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiBook, FiMail, FiPhone, FiMapPin, 
  FiFacebook, FiTwitter, FiLinkedin, FiGithub,
  FiHeart 
} from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Features', path: '/features' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Demo', path: '/demo' },
      { name: 'FAQ', path: '/faq' },
    ],
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'Careers', path: '/careers' },
      { name: 'Blog', path: '/blog' },
      { name: 'Press', path: '/press' },
    ],
    resources: [
      { name: 'Documentation', path: '/docs' },
      { name: 'Community', path: '/community' },
      { name: 'Support', path: '/support' },
      { name: 'Status', path: '/status' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Security', path: '/security' },
    ]
  }

  const socialLinks = [
    { icon: FiFacebook, href: 'https://facebook.com', color: 'hover:text-blue-600' },
    { icon: FiTwitter, href: 'https://twitter.com', color: 'hover:text-sky-500' },
    { icon: FiLinkedin, href: 'https://linkedin.com', color: 'hover:text-blue-700' },
    { icon: FiGithub, href: 'https://github.com', color: 'hover:text-gray-900' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FiBook className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">StudySmart</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transform your study habits with AI-powered scheduling and smart analytics.
              Join thousands of students who study smarter, not harder.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-gray-400">
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span>support@studysmart.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  className={`p-2 bg-gray-800 rounded-lg text-gray-400 ${social.color} transition-colors`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Subscribe to our newsletter</h3>
              <p className="text-gray-400 text-sm">
                Get study tips and product updates delivered weekly.
              </p>
            </div>
            <form className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-indigo-500 text-white"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-r-lg hover:from-indigo-700 hover:to-purple-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p className="flex items-center">
              © {currentYear} StudySmart. All rights reserved. 
              Made with <FiHeart className="w-4 h-4 mx-1 text-red-500 inline" /> by the team
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white">Privacy</Link>
              <Link to="/terms" className="hover:text-white">Terms</Link>
              <Link to="/cookies" className="hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer