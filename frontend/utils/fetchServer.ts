import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { auth } from "@/lib/auth";
export const fetchServer = async <T = any>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  const session = await auth();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(session && { Authorization: `Bearer ${session.accessToken}` }),
  };

  const response: AxiosResponse<T> = await axios({
    url,
    ...options,
    headers,
  });

  return response;
};
