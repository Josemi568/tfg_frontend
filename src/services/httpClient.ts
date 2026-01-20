import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'https://your-api-url.com/api', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the JWT in the headers
httpClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt'); // Assuming 'jwt' is the key used to store the token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default httpClient;