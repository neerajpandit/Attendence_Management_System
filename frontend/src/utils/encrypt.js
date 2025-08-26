import CryptoJS from 'crypto-js';
const SECRET_KEY = import.meta.env.VITE_HMAC_SECRET_KEY;

// Function to encrypt data
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export default encryptData;
