import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import { 
  FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight,
  FiBook, FiClock, FiTarget 
} from 'react-icons/fi'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const success = await login(email, password)
    if (success) navigate('/dashboard')
    setLoading(false)
  }

  // Floating particles animation
  const particles = Array.from({ length: 30 })

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      
      {/* Animated background particles */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: Math.random() * 6 + 2 + 'px',
            height: Math.random() * 6 + 2 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5 + 0.2,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      {/* Main Content - Centered */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex items-center space-x-4 mb-8"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                <FiBook className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Smart Study</h1>
                <p className="text-2xl text-yellow-300 font-semibold">Scheduler</p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-white/90 leading-relaxed"
            >
              Welcome back! Continue your learning journey with personalized study plans,
              smart scheduling, and progress tracking.
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4 mt-8"
            >
              {[
                { icon: FiClock, text: "Smart scheduling algorithm that adapts to you" },
                { icon: FiTarget, text: "Track your progress with detailed analytics" },
                { icon: FiBook, text: "Personalized study plans for every subject" },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                >
                  <feature.icon className="w-6 h-6 text-yellow-300 flex-shrink-0" />
                  <span className="text-white/90">{feature.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-between mt-12 pt-8 border-t border-white/20"
            >
              <div className="text-center">
                <div className="text-3xl font-bold">10k+</div>
                <div className="text-sm text-white/70">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50k+</div>
                <div className="text-sm text-white/70">Tasks Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">98%</div>
                <div className="text-sm text-white/70">Satisfaction</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Login Form (Centered Transparent) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome Back! 👋</h2>
                  <p className="text-white/70">Sign in to continue your learning journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  {/* Remember me & Forgot password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 bg-white/10 border-white/20 rounded focus:ring-white/20"
                      />
                      <span className="ml-2 text-sm text-white/70">Remember me</span>
                    </label>
                    
                  </div>

                  {/* Login Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white text-indigo-900 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2 mt-6"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-indigo-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <FiArrowRight />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Register Link */}
                <p className="mt-6 text-center text-white/70">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-white font-semibold hover:underline">
                    Sign up now
                  </Link>
                </p>

                {/* Terms */}
                <p className="mt-4 text-center text-xs text-white/50">
                  By signing in, you agree to our{' '}
                  <Link to="/terms" className="hover:text-white/70">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="hover:text-white/70">Privacy Policy</Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Login