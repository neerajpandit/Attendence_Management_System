import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

export const fetchEntityList = (payload) => async(dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(
      `entity`
    );
    console.log("response EntityList",response);
    dispatch(stopLoading());
    return response.data;
    
  } catch (error) {
    
  }
}

// API to fetch property list
export const fetchPropertyList = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.post(
      `/fetch-property-list?propertyTypeId=${payload.propertyType}&page=${payload.page}&limit=${payload.limit}`
    );
    console.log(response);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

// API to fetch unit list
export const fetchUnitList = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(
      `/unit?propertyTypeId=${payload.propertyType}&page=${payload.page}&limit=${payload.limit}`
    );
    console.log(response);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

// API to fetch unit details
export const fetchUnitListDetails = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(`/unit/${payload.unitId}`);
    console.log(response);
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

// API to add category
export const addCategory = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const result = await apiClient.post('/add-category', formData, {
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

// API to add category
export const updateCategory = (formData) => async (dispatch) => {
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

// API to add unit
export const addUnit = (formData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const result = await apiClient.post('/unit', formData, {
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

// API to update unit
export const updateUnit =
  ({ formData, id }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const result = await apiClient.put(`/unit/${id}`, formData, {
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

// API to assign tenant
export const assignTenant = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const result = await apiClient.post(`lease-agreement`, payload, {
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

export const toggleUnitStatus = (unitId, payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    // Detect if payload is FormData (for file upload)
    const isFormData = payload instanceof FormData;
    const result = await apiClient.put(
      `/unit/${unitId}/mark-status`,
      payload,
      isFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined
    );
    dispatch(stopLoading());
    return result.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

// API to fetch tenant list
export const fetchTenantList = (payload) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiClient.get(
      `/tenant-list?page=${payload.page || 1}&limit=${payload.limit || 10000}`
    );
    dispatch(stopLoading());
    return response.data;
  } catch (error) {
    dispatch(stopLoading());
    return handleApiError(error);
  }
};

export const fetchUnitDetails = () => async (dispatch) => {
  dispatch(startLoading());

  try {
    const response = await apiClient.get('/tenant/unit-details');

    dispatch(stopLoading());

    const units = response?.data?.data;

    // Always return an array
    return Array.isArray(units) ? units : [];
  } catch (error) {
    dispatch(stopLoading());
    console.error('Fetch unit error:', error);
    handleApiError(error);
    return [];
  }
};

// Function to trigger file download
const downloadFile = (blob, filename) => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click(); // Trigger download
  URL.revokeObjectURL(link.href); // Clean up the URL object
};

// API to download MIS Report
// export const downloadMISReport = (payload) => async (dispatch) => {
//   try {
//     // Make a post request to generate the Excel file
//     const response = await apiClient.get('mis-report', payload, {
//       responseType: 'blob',
//     });

//     // Create a Blob from the response data
//     const fileBlob = new Blob([response.data], { type: EXCEL_MIME_TYPE });

//     // Trigger the file download
//     downloadFile(fileBlob, 'mis_report.xlsx');

//     return { success: true };
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

// FETCH data (no file download)
export const fetchMISReportData = () => async () => {
  try {
    const response = await apiClient.get('mis-report');
    return { success: true, data: response.data };
  } catch (error) {
    return handleApiError(error);
  }
};

// DOWNLOAD file
// export const downloadMISReport = () => async () => {
//   try {
//     const response = await apiClient.get('mis-report', {
//       responseType: 'blob',
//     });

//     const fileBlob = new Blob([response.data], {
//       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     });

//     downloadFile(fileBlob, 'mis_report.xlsx');

//     return { success: true };
//   } catch (error) {
//     return handleApiError(error);
//   }
// };
