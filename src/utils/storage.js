export const setToken = token => {
  localStorage.setItem('jwt', token)
}

export const getToken = () => {
  return localStorage.getItem('jwt')
}

export const removeToken = () => {
  localStorage.removeItem('jwt')
}

export const setItem = (key, value) => {
  localStorage.setItem(key, value)
}

export const getItem = key => {
  return localStorage.getItem(key)
}

export const removeItem = key => {
  localStorage.removeItem(key)
}

export const isAdminUser = () => {
  try {
    const token = getToken()
    if (!token) return false
    const parts = token.split('.')
    if (parts.length < 2) return false
    const payload = JSON.parse(atob(parts[1]))
    const roles = payload.roles || payload.authorities || payload.role || payload.rolesGranted || []
    if (Array.isArray(roles)) return roles.includes('ROLE_ADMIN')
    if (typeof roles === 'string') return roles === 'ROLE_ADMIN'
    return false
  } catch (e) {
    return false
  }
}

export default { setToken, getToken, removeToken, setItem, getItem, removeItem, isAdminUser }
