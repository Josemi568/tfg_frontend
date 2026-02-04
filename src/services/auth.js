import httpClient from './httpClient'
import { setToken, removeToken } from '../utils/storage'

const LOGIN_URL = '/api/login' // Replace with your actual login endpoint
const REGISTER_URL = '/api/register' // Replace with your actual register endpoint

export const login = async (username, password) => {
  try {
    const payload = { username }
    if (password !== undefined) payload.password = password

    const response = await httpClient.post(LOGIN_URL, payload)
    // assume server returns { token: '...' }
    const token = response?.data?.token || response?.data

    if (token) {
      setToken(token)
    }

    return token
  } catch (error) {
    throw new Error('Login failed')
  }
}

export const register = async user => {
  try {
    const response = await httpClient.post("http://localhost:8000/api/register", user)
    const token = response?.data?.token || response?.data

    if (token) {
      setToken(token)
    }

    return token
  } catch (error) {
    throw new Error('Register failed')
  }
}

// alias used by hooks/useAuth.js
export const loginUser = login

export const logout = () => {
  removeToken()
}

export default { login, loginUser, logout, register }
