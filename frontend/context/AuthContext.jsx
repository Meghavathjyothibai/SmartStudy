import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  // Setup axios interceptor for auth
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.request.eject(interceptor)
    }
  }, [token])

  // Setup response interceptor for token expiry
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout()
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [])

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await axios.get('/api/auth/me')
        setUser(response.data.user)
      } catch (error) {
        console.error('Failed to load user:', error)
        localStorage.removeItem('token')
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [token])

  // Setup socket connection when user is logged in
  useEffect(() => {
    if (user && token) {
      const newSocket = io(import.meta.env.VITE_API_URL || window.location.origin, {
        auth: { token }
      })

      newSocket.on('connect', () => {
        console.log('Socket connected')
      })

      newSocket.on('notification', (data) => {
        toast.custom((t) => (
          <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-primary-600">
            <h4 className="font-semibold">{data.title}</h4>
            <p className="text-sm text-gray-600">{data.message}</p>
          </div>
        ))
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [user, token])

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      toast.success('Welcome back!')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      setToken(token)
      setUser(user)
      
      toast.success('Account created successfully!')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    if (socket) {
      socket.close()
    }
    toast.success('Logged out successfully')
  }

  const updateUser = async (userData) => {
    try {
      const response = await axios.put('/api/auth/profile', userData)
      setUser(response.data.user)
      toast.success('Profile updated')
      return true
    } catch (error) {
      toast.error('Failed to update profile')
      return false
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    socket,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}