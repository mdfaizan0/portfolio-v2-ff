export function hardLogout() {
  try {
    localStorage.removeItem("token");
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout error:", err);
  }
}