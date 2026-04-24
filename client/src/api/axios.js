// =============================================
// src/api/axios.js - Axios Configuration
// =============================================

import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:3001/api",
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
