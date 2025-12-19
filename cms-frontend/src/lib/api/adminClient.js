import axios from "axios"
import { hardLogout } from "../auth/hardLogout"
import { notify } from "../toast/notify"

export const adminClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api/admin`
})

adminClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

adminClient.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        const status = error.response?.status
        if (status === 401) {
            hardLogout()
            notify.error("Session expired. Please log in again.", "error")
        }

        if (status === 403) {
            notify.warning("Superadmin access required", "error")
        }

        if (status >= 500) {
            notify.error("Server error. Try again.", "error")
        }

        return Promise.reject(error)
    }
)