export function saveToken(token) {
    localStorage.setItem("token", token)
}

export function getToken() {
    return localStorage.getItem("token")
}

export function removeToken() {
    localStorage.removeItem("token")
}

export function decodeToken(token) {
    try {
        const base64URL = token.split('.')[1]
        const base64 = base64URL.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload)
    } catch (e) {
        console.error(e.message)
        return null
    }
}

export function isExpired(token) {
    const payload = decodeToken(token)
    return payload.exp * 1000 < Date.now()
}