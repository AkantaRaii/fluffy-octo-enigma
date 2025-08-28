const NEXT_PUBLIC_BASE_URL = "http://localhost:8000";
import axios from "axios";
const api = axios.create({
  baseURL: NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api; 