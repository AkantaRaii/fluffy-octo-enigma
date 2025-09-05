import axios from "axios";
import { auth } from "@/lib/auth";
const apiServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiServer.interceptors.request.use(async (config) => {
  const session = await auth();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

export default apiServer;
