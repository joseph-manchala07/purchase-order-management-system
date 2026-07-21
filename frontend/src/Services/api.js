import axios from "axios";

const apiHost = window.location.hostname;
const apiProtocol = window.location.protocol;

const api = axios.create({
  baseURL: `${apiProtocol}//${apiHost}:2500/api`
});

export default api;