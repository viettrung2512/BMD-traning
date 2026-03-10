import axios from "axios";
import useCookie from "../hooks/useCookie";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use(
  (config) => {
    const token = useCookie("access_token").getCookie();
    if (token) {
      config.headers["token"] = token; 
    }
    config.headers["namespace"] = "viettrung"; 
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          console.error("Bad Request:", data?.message || "Invalid request");
          useCookie("access_token").clearCookie(); 
          break;
          
        case 401:
          console.error("Unauthorized:", data?.message || "Please login again");
          useCookie("access_token").clearCookie();
          window.location.href = "/login"; 
          break;
          
        case 403:
          console.error("Forbidden:", data?.message || "You don't have permission");
          break;
          
        case 404:
          console.error("Not Found:", data?.message || "Resource not found");
          break;
          
        case 500:
          console.error("Server Error:", data?.message || "Internal server error");
          break;
          
        case 504:
          console.error("Service Unavailable:", "Server is temporarily unavailable");
          break;
          
        default:
          console.error("HTTP Error:", status, data?.message || "Unknown error occurred");
      }
      
      const customError = {
        status,
        message: data?.message || `HTTP Error ${status}`,
        data: data,
        originalError: error
      };
      
      return Promise.reject(customError);
      
    } else if (error.request) {
      console.error("Network Error:", error.message);
      const networkError = {
        status: 0,
        message: "Network error - Please check your internet connection",
        originalError: error
      };
      return Promise.reject(networkError);
      
    } else {
      console.error("Request Setup Error:", error.message);
      const setupError = {
        status: -1,
        message: "Request configuration error",
        originalError: error
      };
      return Promise.reject(setupError);
    }
  }
);

export default api;