import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useSession } from "next-auth/react";

export const fetchClient = async <T = any>(
  url: string,
  options: AxiosRequestConfig = {}
): Promise<T> => {
  const { data: session } = useSession();

  const headers = {
    ...options.headers,
    ...(session?.accessToken && {
      Authorization: `Bearer ${session.accessToken}`,
    }),
  };

  const response: AxiosResponse<T> = await axios({
    url,
    ...options,
    headers,
  });

  return response.data;
};
