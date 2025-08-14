import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export const fetchServer = async <T = any>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  const session = await auth();

  const headers = {
    ...options.headers,
    ...(session && { Authorization: `Bearer ${session.accessToken}` }),
  };

  const response: AxiosResponse<T> = await axios({
    url,
    ...options,
    headers,
  });

  return response.data;
};
