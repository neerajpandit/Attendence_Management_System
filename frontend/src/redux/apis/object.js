import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

// API to update object status (user, zone, circle, bank, branches)
export const updateStatus = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.put(`/${payload.type}/${payload.id}`, {
      status: payload.status,
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// API to create new object (user, zone, circle, bank, branches)
export const newObject = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.post(`/${payload.type}`, payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// API to fetch objects (user, zone, circle, bank, branches)
export const fetchObjects = (payload) => async (dispatch) => {
  if (payload.from !== 'modal') {
    dispatch(startLoading());
  }
  try {
    const response = await apiClient.get(
      `/${payload.type}?page=${payload.page}&limit=${payload.limit}`,
      {
        type: payload.type,
        status: payload.status || undefined,
        page: payload.page,
        limit: payload.limit,
        sortBy: payload.sortBy,
        sortOrder: payload.sortOrder,
      }
    );
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};
