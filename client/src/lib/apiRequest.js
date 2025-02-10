import axios from "axios";

const apiRequest = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:8800/api" : "/api",
    withCredentials: true
});

export default apiRequest