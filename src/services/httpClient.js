import axios from 'axios'

const httpClient = axios.create({
<<<<<<< HEAD
  baseURL: 'http://localhost:8000/api', // Local API base URL
=======
  baseURL: 'https://your-api-url.com/api', // Replace with your API base URL
>>>>>>> b50d84c1fa41c3363ebb7235a2b40b4dde41bdf9
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add a request interceptor to include the JWT in the headers
httpClient.interceptors.request.use(
  config => {
<<<<<<< HEAD
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

=======
>>>>>>> b50d84c1fa41c3363ebb7235a2b40b4dde41bdf9
    const token = localStorage.getItem('jwt') // Assuming 'jwt' is the key used to store the token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
<<<<<<< HEAD
    // log non-auth requests for debugging (omit large bodies)
    console.debug('[httpClient] request', {
      method: config.method,
      url: config.url,
      headers: config.headers,
    })
=======
>>>>>>> b50d84c1fa41c3363ebb7235a2b40b4dde41bdf9
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

<<<<<<< HEAD
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

=======
>>>>>>> b50d84c1fa41c3363ebb7235a2b40b4dde41bdf9
export default httpClient
