import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

export const fetchInstituteList = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(`/institute/entity`);
    console.log('response EntityList', response);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {}
};

//APi Add Entity
export const addInstitute = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const result = await apiClient.post('/institute', formData, {
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
export const updateInstitute = (formData) => async (dispatch) => {
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
