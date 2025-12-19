import axios from "axios";

export const uploadClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/admin`
});

uploadClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        config.headers["Content-Type"] = "multipart/form-data";
        return config;
    },
    (error) => Promise.reject(error)
);

uploadClient.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error)
);
