import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

// API to fetch property list
export const rentList = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(`/bills`, payload);
    // console.log(response)
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

// API to pay rent
export const payRent = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.post(`payment/create-order`, payload);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

// API to verify payment
export const verifyPayment = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.post(`payment/verify-payment`, payload);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

// export const fetchTenantDeatils = (payload) => async (dispatch) => {
//   dispatch(startLoading());
//   try {
//     const response = await apiClient.get(`/tenant-details/${payload.tenantId}`);
//     console.log(response);
//     dispatch(stopLoading());
//     return response.data;
//   } catch (error) {
//     dispatch(stopLoading());
//     return handleApiError(error);
//   }
// };
