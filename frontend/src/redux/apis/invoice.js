import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

export const invoicePdf = (invoiceId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(`/bills/invoice/${invoiceId}`, {
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
