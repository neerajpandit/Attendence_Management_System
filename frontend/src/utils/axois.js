import axios from 'axios';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const SECRET_KEY = import.meta.env.VITE_HMAC_SECRET_KEY;

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1/`,
});

// Function to generate a consistent hashable string from FormData
const formDataToString = (formData) => {
  const sortedEntries = [...formData.entries()]
    .map(([key, value]) => {
      if (value instanceof File) {
        return `${key}=${value.name}`; // Use file name for consistency
      }
      return `${key}=${value}`;
    })
    .sort((a, b) => a.localeCompare(b)) // Sort for consistency
    .join('&');

  return sortedEntries;
};

apiClient.interceptors.request.use(
  async (config) => {
    if (!config.headers['skipAuth']) {
      const token = Cookies.get('accessToken');
      console.log("ttt",token);
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } else {
      delete config.headers['skipAuth'];
    }

    let payloadString;

    if (config.data instanceof FormData) {
      // Convert FormData to a consistent string
      payloadString = formDataToString(config.data);
    } else {
      // Convert JSON data to string
      payloadString = JSON.stringify(config.data);
    }

    // In case the payload is empty, we use an empty string (""),
    if (!payloadString) {
      payloadString = ''; // Make sure payloadString is empty for empty bodies
    }

    // Generate HMAC hash
    const hash = CryptoJS.HmacSHA256(payloadString, SECRET_KEY).toString();

    // Set headers for integrity verification
    config.headers['X-Signature'] = hash;

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
