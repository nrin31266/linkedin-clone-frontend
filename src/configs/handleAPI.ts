import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface RequestParams<T, B = unknown> {
  endpoint: string;
  body?: B;
  method?: "post" | "get" | "delete" | "put";
  onSuccess?: (data: T) => void;
  onFailure?: (error: string) => void;
  onFinally?: () => void;
  isAuthenticated?: boolean;
}



const handleAPI = async <T, B = unknown>({
  endpoint,
  body,
  method = "get",
  onFailure,
  onSuccess,
  onFinally,
  isAuthenticated = true
}: RequestParams<T, B>): Promise<void> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (isAuthenticated) {
      const token = localStorage.getItem("token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const res = await axios({
      url: endpoint,
      method,
      data: body,
      headers,
      baseURL: API_BASE_URL,
      timeout: 5000
    });

    onSuccess?.(res.data.data);
  } catch (error) {
    if (onFailure) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const { code, message } = error.response.data;
        if (typeof code === "number" && typeof message === "string") {
          onFailure(message);
          return;
        }
      }
      onFailure("An unexpected error occurred.");
    }
  } finally {
    onFinally?.();
  }
};

export default handleAPI;
