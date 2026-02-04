import { useState, useEffect } from 'react'
import { getToken, setToken, removeToken } from '../utils/storage'
import { loginUser } from '../services/auth'

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = async username => {
    try {
      const token = await loginUser(username)
      setToken(token)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Login failed:', error)
      setIsAuthenticated(false)
    }
  }

  const logout = () => {
    removeToken()
    setIsAuthenticated(false)
  }

  return { isAuthenticated, loading, login, logout }
}

export default useAuth
