import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

// API to fetch property list
export const fetchTenantList = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(
      `/tenant-list?page=${payload.page}&limit=${payload.limit}`
    );
    // console.log(response)
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

export const fetchTenantDeatils = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(`/tenant-details/${payload.tenantId}`);
    console.log(response);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

export const fetchTenantTypes = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get('/tenant-types');
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

// export const registerTenant = async (formDataObject) => {
//   try {
//     const form = new FormData();

//     for (const key in formDataObject) {
//       const value = formDataObject[key];
//       if (key === 'documents' && Array.isArray(value)) {
//         value.forEach((file) => form.append('documents', file));
//       } else if (typeof value === 'object' && value !== null) {
//         form.append(key, JSON.stringify(value));
//       } else {
//         form.append(key, value);
//       }
//     }

//     const response = await apiClient.post('/tenant-registration', form, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });

//     return response.data;
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

export const registerTenant = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const result = await apiClient.post('/tenant-registration', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch(stopLoading());
    return result.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};
