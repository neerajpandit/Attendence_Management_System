import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

export const fetchOrganizationList = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(`/superadmin/organization-list`);
    console.log('response Organization', response);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {}
};

//APi Add Entity
export const addOrganization = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const result = await apiClient.post('/auth', formData, {
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
