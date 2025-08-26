import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

export const fetchEntityList = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(`entity`);
    console.log('response EntityList', response);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {}
};

//APi Add Entity
export const addEntity = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const result = await apiClient.post('/entity', formData, {
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

// API to Update Entity
export const updateEntity = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const result = await apiClient.post('/update-category', formData, {
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