import { axiosInstance } from "../utils/axios";

export const signupUser = async (formData) => {
  const { data } = await axiosInstance.post("/users/signup", formData);
  return data;
};

export const loginUserApi = async ({ email, password }) => {
  const { data } = await axiosInstance.post("/users/login", {
    email,
    password,
  });
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await axiosInstance.post("/users/forgot-password", {
    email,
  });
  return data;
};

export const resetPassword = async ({ resetToken, newPassword }) => {
  const { data } = await axiosInstance.post("/users/reset-password", {
    resetToken,
    newPassword,
  });
  return data;
};
