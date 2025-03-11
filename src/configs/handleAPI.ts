import axios from "axios";
import { ErrorResponse } from "../errors/ErrorResponse";

import axiosInstance from "./axiosConfig";

interface RequestParams<T> {
  endpoint: string;
  body?: any;
  method?: "post" | "get" | "delete" | "put";
  onSuccess?: (data: T) => void;
  onFailure?: (error: string) => void;
  onFinally?: () => void;
}

const handleAPI  = async <T>({
  endpoint,
  body,
  method = "get",
  onFailure,
  onSuccess,
  onFinally
}: RequestParams<T>): Promise<void> => {
  try {
    const res = await axiosInstance(endpoint, { method, data: body });
    onSuccess && onSuccess(res.data.data);
  } catch (error) {
    
    if (onFailure) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code, message, details } = error.response.data;
        if (typeof code === "number" && typeof message === "string") {
          onFailure(message);
          return;
        }
      }
      onFailure("An unexpected error occurred.");
    }
    
  } finally{
    onFinally && onFinally();
  }
};

export default handleAPI;
