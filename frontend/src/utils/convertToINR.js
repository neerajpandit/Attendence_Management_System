import axios from 'axios';
import { debounce } from 'lodash';

const API_KEY = import.meta.env.VITE_EXCHANGE_RATEAPI_KEY;

const fetchRates = async (currencyCode) => {
  try {
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${currencyCode}`
    );
    return response.data.conversion_rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    return null;
  }
};

// Debounced function
const debouncedFetchRates = debounce(fetchRates, 1000); // 500ms delay

const convertToINR = async (currencyCode, amount) => {
  try {
    const rates = await debouncedFetchRates(currencyCode);
    if (!rates || !rates.INR)
      throw new Error('Invalid currency or missing rates.');

    const convertedAmount = amount * rates.INR;
    return convertedAmount.toFixed(2);
  } catch (error) {
    return null;
  }
};

export default convertToINR;
