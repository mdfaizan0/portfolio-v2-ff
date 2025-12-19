import axios from "axios";
import { notify } from "../toast/notify";

export const publicClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`
})

publicClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        notify("Unable to load content.", "error");
        return Promise.reject(error);
    }
);