import { axiosWrapper } from "./axiosWrapper";

// API Endpoints

// Auth Endpoints
export const login = (data) => axiosWrapper.post("/api/user/login", data);
export const register = (data) => axiosWrapper.post("/api/user/register", data);
export const getUserData = () => axiosWrapper.get("/api/user");
export const logout = () => axiosWrapper.post("/api/user/logout");

// Table Endpoints
export const addTable = (data) => axiosWrapper.post("/api/table/", data);
export const getTables = () => axiosWrapper.get("/api/table");
export const updateTable = ({ tableId, ...tableData }) =>
  axiosWrapper.put(`/api/table/${tableId}`, tableData);
export const deleteTable = (id) => axiosWrapper.delete(`/api/table/${id}`);
export const updateTableDetails = (id, data) => axiosWrapper.put(`/api/table/detail/${id}`, data);

// Payment Endpoints
export const createOrderRazorpay = (data) =>
  axiosWrapper.post("/api/payment/create-order", data);
export const verifyPaymentRazorpay = (data) =>
  axiosWrapper.post("/api/payment/verify-payment", data);

// Order Endpoints
export const addOrder = (data) => axiosWrapper.post("/api/order/", data);
export const getOrders = () => axiosWrapper.get("/api/order");
export const updateOrderStatus = ({ orderId, orderStatus }) =>
  axiosWrapper.put(`/api/order/${orderId}`, { orderStatus });

// Menu Endpoints
export const getMenuItems = () => axiosWrapper.get("/api/menu");
export const createMenuItem = (data) => axiosWrapper.post("/api/menu", data);
export const updateMenuItem = (id, data) => axiosWrapper.put(`/api/menu/${id}`, data);
export const deleteMenuItem = (id) => axiosWrapper.delete(`/api/menu/${id}`);
