import axios from 'axios';

// Ensure this file uses the store's token, or we can just pass token as an argument.
// Let's create utility functions to handle the Razorpay flow
const apiBase = axios.create({
  baseURL: 'http://localhost:5000/api'
});

const getAuthHeaders = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? { Authorization: `Bearer ${JSON.parse(userInfo).token}` } : {};
};

export const createOrderAPI = async (orderPayload) => {
  const { data } = await apiBase.post('/orders', orderPayload, {
    headers: getAuthHeaders(),
  });
  return data;
};

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const getRazorpayConfig = async () => {
  const { data } = await apiBase.get('/payment/config', { headers: getAuthHeaders() });
  return data.keyId;
};

export const createRazorpayOrderAPI = async (amount, orderId) => {
  const { data } = await apiBase.post('/payment/create-order', { amount, orderId }, {
    headers: getAuthHeaders(),
  });
  return data.order;
};

export const verifyRazorpayPaymentAPI = async (paymentData) => {
  const { data } = await apiBase.post('/payment/verify', paymentData, {
    headers: getAuthHeaders(),
  });
  return data;
};
