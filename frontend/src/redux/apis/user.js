import apiClient from '../../utils/axois';
import { handleApiError } from '../../utils/apiError';
import { startLoading, stopLoading } from '../slices/loadingSlice';

// API to fetch users list
export const fetchUsers = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.post(`/user/fetch-users`, payload);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

// API to fetch level details
export const fetchLevelDetails = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.post(`/user/fetch-level-details`, payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// API to fetch users list
export const updateCheckerDetails = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.post(
      `/user/update-checker-details`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// API to fetch checkers total levels
export const fetchTotalLevels = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.post(`/user/fetch-total-levels`, payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// API to add new user
export const newUser = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.post(`/user/new-user`, payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
