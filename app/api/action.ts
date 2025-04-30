import { message } from "antd";
import axios from "axios";

const baseURL = "http://localhost:5000";

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 1000000,
});

instance.interceptors.request.use(
  async (config) => {
    const tokenString = localStorage.getItem("token");

    if (tokenString) {
      config.headers.Authorization = "Bearer " + tokenString;
    } else {
      delete instance.defaults.headers.common.Authorization;
    }
    config.headers["Accept-Language"] = "mn-MN";

    return config;
  },
  (error) => Promise.reject(error)
);

// instance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem("token");
//       message.error("Дахин нэвтрэнэ үү", 5, () => {
//         if (typeof window !== "undefined") {
//           window.location.href = "/signin";
//         }
//       });

//       if (typeof window !== "undefined") {
//         window.location.href = "/signin";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export const signin = async (body: any) => {
  try {
    const response = await instance.post("/auth/signin", body);
    localStorage.setItem("token", response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const signup = async (body: any) => {
  try {
    const response = await instance.post("/auth/signup", body);
    localStorage.setItem("token", response.data);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const CreateTest = async (data: any) => {
  try {
    const response = await instance.post("/api/test", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const GetTestById = async (id: string) => {
  try {
    const response = await instance.get(`/api/test/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const UpdateTestById = async (id: string, data: any) => {
  try {
    const response = await instance.put(`/api/test/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

