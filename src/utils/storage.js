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

export default { setToken, getToken, removeToken, setItem, getItem, removeItem }
