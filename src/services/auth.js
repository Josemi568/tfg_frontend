import httpClient from './httpClient'
import { setToken, removeToken, setItem, removeItem } from '../utils/storage'

const LOGIN_URL = '/login' // relative to httpClient.baseURL
const REGISTER_URL = '/register' // relative to httpClient.baseURL

export const login = async (username, password) => {
  try {
    const payload = { username }
    if (password !== undefined) payload.password = password

    const response = await httpClient.post(LOGIN_URL, payload)
    const token = response?.data?.token || response?.data

    if (token) {
      setToken(token)
      setItem('username', username)
    }

    return token
  } catch (error) {
    console.error('[auth] login error', {
      username,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error
  }
}

export const register = async user => {
  try {
    const response = await httpClient.post(REGISTER_URL, user)
    const token = response?.data?.token || response?.data

    if (token) {
      setToken(token)
    }

    return token
  } catch (error) {
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
  }
}

export const changeRole = async id => {
  try {
    const response = await httpClient.post(`/user/${id}/change-role`)
    return response?.data
  } catch (error) {
    console.error('[auth] changeRole error', {
      id,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error
  }
}

export const changeStatus = async id => {
  try {
    const response = await httpClient.post(`/user/${id}/change-status`)
    return response?.data
  } catch (error) {
    console.error('[auth] changeStatus error', {
      id,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    })
    throw error
  }
}

// alias used by hooks/useAuth.js
export const loginUser = login

export const logout = () => {
  removeToken()
  removeItem('username')
}

export default { login, loginUser, logout, register, changeRole, changeStatus }
