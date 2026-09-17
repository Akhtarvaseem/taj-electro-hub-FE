import axios from "axios";

// Central Axios instance — the ONLY place that talks to the backend.
//
// Two supported modes (set in frontend-react/.env):
//  1. Direct:  VITE_API_BASE_URL="http://localhost:8080"  -> calls http://localhost:8080/api/...
//  2. Proxy:   VITE_API_BASE_URL=""                        -> calls /api/... (Vite proxies to backend)
const RAW_BASE =
  import.meta.env.VITE_API_BASE_URL !== undefined
    ? import.meta.env.VITE_API_BASE_URL
    // : "http://localhost:8080";
    : "https://taj-electro-hub-be.onrender.com";

const api = axios.create({
  baseURL: `${RAW_BASE}/api`,
});

// Attach JWT token from localStorage to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("eh_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is invalid/expired, clear it so the app returns to logged-out state.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("eh_token");
    }
    return Promise.reject(err);
  }
);

export default api;
