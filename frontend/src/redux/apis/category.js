import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

export const fetchCategoryList = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get('/category');
    console.log('response EntityList', response);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {}
};

//APi Add Entity
export const addCategory = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const result = await apiClient.post('/category', formData, {
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
