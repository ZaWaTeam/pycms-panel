import axios from 'axios'

const axiosIns = axios.create({
  // You can add your headers here
  // ================================
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // timeout: 1000,
});

const token = localStorage.getItem("_auth.token");
if (token) {
    axiosIns.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default axiosIns;
