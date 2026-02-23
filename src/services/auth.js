import httpClient from './httpClient'
<<<<<<< HEAD
import { setToken, removeToken, setItem, removeItem } from '../utils/storage'

const LOGIN_URL = '/login' // relative to httpClient.baseURL
const REGISTER_URL = '/register' // relative to httpClient.baseURL
=======
import { setToken, removeToken } from '../utils/storage'

const LOGIN_URL = '/api/login' // Replace with your actual login endpoint
const REGISTER_URL = '/api/register' // Replace with your actual register endpoint
>>>>>>> b50d84c1fa41c3363ebb7235a2b40b4dde41bdf9

export const login = async (username, password) => {
  try {
    const payload = { username }
    if (password !== undefined) payload.password = password

    const response = await httpClient.post(LOGIN_URL, payload)
<<<<<<< HEAD
=======
    // assume server returns { token: '...' }
>>>>>>> b50d84c1fa41c3363ebb7235a2b40b4dde41bdf9
    const token = response?.data?.token || response?.data

    if (token) {
      setToken(token)
<<<<<<< HEAD
      setItem('username', username)
=======
>>>>>>> b50d84c1fa41c3363ebb7235a2b40b4dde41bdf9
    }

    return token
  } catch (error) {
<<<<<<< HEAD
    console.error('[auth] login error', {
      username,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error
=======
    throw new Error('Login failed')
>>>>>>> b50d84c1fa41c3363ebb7235a2b40b4dde41bdf9
  }
}

export const register = async user => {
  try {
<<<<<<< HEAD
    const response = await httpClient.post(REGISTER_URL, user)
=======
    const response = await httpClient.post("http://localhost:8000/api/register", user)
>>>>>>> b50d84c1fa41c3363ebb7235a2b40b4dde41bdf9
    const token = response?.data?.token || response?.data

    if (token) {
      setToken(token)
    }

    return token
  } catch (error) {
<<<<<<< HEAD
    console.error('[auth] register error', {
      user: { username: user?.username },
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })

    // Retry with admin token defined in Vite env (VITE_ADMIN_TOKEN)
    try {
      const adminToken = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_ADMIN_TOKEN : undefined
      if (error.response?.status === 401 && adminToken) {
        console.debug('[auth] retrying register with admin token')
        const response2 = await httpClient.post(REGISTER_URL, user, {
          headers: { Authorization: `Bearer ${adminToken}` },
        })
        const token2 = response2?.data?.token || response2?.data
        if (token2) setToken(token2)
        return token2
      }
    } catch (err2) {
      console.error('[auth] admin-token retry failed', err2)
    }

    throw error
=======
    throw new Error('Register failed')
>>>>>>> b50d84c1fa41c3363ebb7235a2b40b4dde41bdf9
  }
}

// alias used by hooks/useAuth.js
export const loginUser = login

export const logout = () => {
  removeToken()
<<<<<<< HEAD
  removeItem('username')
=======
>>>>>>> b50d84c1fa41c3363ebb7235a2b40b4dde41bdf9
}

export default { login, loginUser, logout, register }
