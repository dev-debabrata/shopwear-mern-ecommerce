import { axiosInstance } from "../utils/axios";

export const getUserData = async () => {
  const { data } = await axiosInstance.get("/users/data");
  return data;
};

// Wishlist
export const addToWishlist = async (productId) => {
  const { data } = await axiosInstance.post("/users/wishlist/add", {
    productId,
  });

  return data;
};

export const removeFromWishlist = async (productId) => {
  const { data } = await axiosInstance.delete(
    `/users/wishlist/remove/${productId}`,
  );

  return data;
};

// Cart
export const addToCart = async (productId, size) => {
  const { data } = await axiosInstance.post("/users/cart/add", {
    productId,
    size,
  });

  return data;
};

export const removeFromCart = async (productId, size) => {
  const { data } = await axiosInstance.post("/users/cart/remove", {
    productId,
    size,
  });

  return data;
};

export const updateCartQuantity = async (productId, size, quantity) => {
  const { data } = await axiosInstance.put("/users/cart/update", {
    productId,
    size,
    quantity,
  });

  return data;
};

export const clearCart = async () => {
  const { data } = await axiosInstance.delete("/users/cart/clear");
  return data;
};
