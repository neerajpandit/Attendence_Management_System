import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import { startLoading, stopLoading } from '../slices/loadingSlice';

export const fetchTenencyTypes = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `/tenancy-types?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchRentFrequencies = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `/rent-frequencies?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchRentalTypes = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `/rental-types?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchOccupancyTypes = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `/occupancy-types?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchPenaltyTypes = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `/penalty-types?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchPenaltyInterestTypes = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `/penalty-interest-types?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchMeasuringUnitTypes = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `/measuring-unit-types?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchRentGenerationTypes = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `/rent-generation-types?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchPropertyDetails = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `get-category/${payload?.categoryId}?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchUnitListCat = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `unit/category/${payload?.categoryId}?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchRentRevisionTypes = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `/rent-revisions?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchConstructionStatusTypes = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `/construction-statuses?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchAdditionalChargesTypes = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `/additional-charge?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchOneTimeChargesTypes = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.get(
      `/one-time-charge?page=${payload?.page || 1}&limit=${payload?.limit || 1000}`,
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
