export const setToken = (token: string) => {
    localStorage.setItem('jwt', token);
};

export const getToken = () => {
    return localStorage.getItem('jwt');
};

export const removeToken = () => {
    localStorage.removeItem('jwt');
};

export const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
};

export const getItem = (key: string) => {
    return localStorage.getItem(key);
};

export const removeItem = (key: string) => {
    localStorage.removeItem(key);
};