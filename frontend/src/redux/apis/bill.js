import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

export const generateBill = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.post('/billing', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
    });
    console.log('response Bill', response);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    console.error('Fetch invoice error:', error);
    handleApiError(error);
    return null;
  }
};


export const invoiceBill = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(`/bills`, {
      responseType: 'blob', // VERY IMPORTANT
    });

    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    console.error('Fetch invoice error:', error);
    handleApiError(error);
    return null;
  }
};
