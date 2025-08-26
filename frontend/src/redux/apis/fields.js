import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

// API to fetch guarantee fields
export const fetchFields = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.post(`/field/fetch-fields`, payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// API to allot guarantee fields to checkers
export const allotFields = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.post(`/field/allot-fields`, payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
