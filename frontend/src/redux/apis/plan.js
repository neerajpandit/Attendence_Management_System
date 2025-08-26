import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

export const fetchPlanList = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(`/plan`);
    console.log('response Plan', response.data);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

//APi Add Entity
export const addPlan = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    console.log("formdata",formData);
    
    const result = await apiClient.post('/plan', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
    });
    console.log("result",result);
    
    dispatch(stopLoading());
    return result.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};
