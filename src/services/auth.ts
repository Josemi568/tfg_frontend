import httpClient from './httpClient';
import { setItem, removeItem } from '../utils/storage';

const LOGIN_URL = '/api/login'; // Replace with your actual login endpoint

export const login = async (username: string, password: string) => {
    try {
        const response = await httpClient.post(LOGIN_URL, { username });
        const { token } = response.data;

        if (token) {
            setItem('jwt', token);
        }

        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
};

export const logout = () => {
    removeItem('jwt');
};