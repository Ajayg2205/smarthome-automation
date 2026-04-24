import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api",
});

// Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Auto-refresh token on 401 error
api.interceptors.response.use(null, async (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem("access");
        window.location.href = "/";
    }
    return Promise.reject(error);
});

export default api;