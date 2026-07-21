import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://10.106.0.69:3000/api"
});

export default api;
