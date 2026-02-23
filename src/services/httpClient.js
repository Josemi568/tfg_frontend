import axios from 'axios'

const httpClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Local API base URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to include the JWT in the headers
httpClient.interceptors.request.use(
  config => {
    const url = config.url || ''
    // Don't attach Authorization header for auth endpoints
    if (url.includes('/login') || url.includes('/register')) {
      // log auth requests for debugging
      console.debug('[httpClient] auth request', {
        method: config.method,
        url: config.url,
        headers: config.headers,
        data: config.data,
      })
      return config
    }

    const token = localStorage.getItem('jwt') // Assuming 'jwt' is the key used to store the token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    // log non-auth requests for debugging (omit large bodies)
    console.debug('[httpClient] request', {
      method: config.method,
      url: config.url,
      headers: config.headers,
    })
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor: log errors for easier debugging
httpClient.interceptors.response.use(
  response => response,
  error => {
    try {
      console.error('[httpClient] response error', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      })
    } catch (e) {
      console.error('[httpClient] response error (failed to parse)', error)
    }
    return Promise.reject(error)
  }
)

export default httpClient
