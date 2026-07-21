import axios from "axios";

const api = axios.create({
  baseURL:
    "http://localhost:2500/api"
});

export default api;