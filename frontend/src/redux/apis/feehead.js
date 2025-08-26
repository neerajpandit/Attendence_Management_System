import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

export const fetchFeeHeadList = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get('/feehead');
    console.log('response EntityList', response);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {}
};

//APi Add Fee Head
export const addFeeHead = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const result = await apiClient.post('/feehead', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
    });
    dispatch(stopLoading());
    return result.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

export const addFeeStructure = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const result = await apiClient.post('/fee', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
    });
    dispatch(stopLoading());
    return result.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};