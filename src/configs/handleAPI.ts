import axiosInstance from "./axiosConfig";


const handleAPI = async (
  url: string,
  data?: any,
  method?: "post" | "get" | "delete" | "put"
) => {
  return await axiosInstance(url, { method: method ?? "get", data });
};

export default handleAPI;
