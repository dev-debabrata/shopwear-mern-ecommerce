import { axiosInstance } from "../utils/axios";

export const getProducts = async () => {
  const { data } = await axiosInstance.get("/products");
  return data.products || data.data || data;
};

export const getProductById = async (id) => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data.product || data.data || data;
};
