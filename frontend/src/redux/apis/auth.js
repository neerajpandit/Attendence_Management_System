import Cookies from 'js-cookie';
import { handleApiError } from '../../utils/apiError';
import apiClient from '../../utils/axois';
import {
  removeUserDetails,
  updateUserDetails,
} from '../slices/userDetailsSlice';
import encryptData from '../../utils/encrypt';

// Login API
export const userLogin = (params) => async (dispatch) => {
  dispatch(removeUserDetails());
  try {
    const payload = {
      // username: encryptData(params.username),
      // password: encryptData(params.password),
      email: params.email,
      password: params.password,
      // captchaInput: params.captchaInput,
      // captchaToken: params.captchaToken,
    };
    const response = await apiClient.post('/auth/login', payload, {
      headers: {
        skipAuth: true,
      },
    });
    console.log("response",response);
    
    const { data } = response;
    if (response.data.statusCode === 200) {
      console.log('Login successful:', data.statusCode, data.data.profileId);
      
      Cookies.set('accessToken', data.data.accessToken, { expires: 1 });
      dispatch(
        updateUserDetails({
          username: data.data?.username,
          name: data.data?.name,
          userId: data.data._id,
          userRole: data.data.role,
          profileId:data.data.profile?._id,
          businessId: data.data?.businessId,
        })
      );
    }
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

// tenant user login
// export const sendTenantOtp = async ({ email, phoneNumber }) => {
//   try {
//     const response = await apiClient.post('/send-otp-both', {
//       email,
//       phoneNumber,
//     });

//     if (response.status === 200 && response.data.success) {
//       return response.data;
//     } else {
//       throw new Error(response.data.message || 'Failed to send OTP');
//     }
//   } catch (error) {
//     return handleApiError(error);
//   }
// };

export const sendTenantOtp = async ({ email, phoneNumber }) => {
  try {
    const response = await apiClient.post('/send-otp-both', {
      email,
      phoneNumber,
    });

    if (response.status === 200 && response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to send OTP');
    }
  } catch (error) {
    return handleApiError(error);
  }
};

export const verifyTenantOtp = async ({
  email,
  phoneNumber,
  phoneOtp,
  emailOtp,
}) => {
  try {
    const response = await apiClient.post('/verify-otp-both', {
      email,
      phoneNumber,
      phoneOtp,
      emailOtp,
    });

    if (response.data.success) {
      // Cookies.set('accessToken', response.data.data.token, { expires: 1 });
      const { token, email, phoneNumber } = response.data.data;
      Cookies.set('accessToken', token, { expires: 1 });
      Cookies.set('email', email, { expires: 1 });
      Cookies.set('phoneNumber', phoneNumber, { expires: 1 });
      Cookies.set('userId', response.data.data.id);

      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to verify OTP');
    }
  } catch (error) {
    return handleApiError(error);
  }
};

export const sendLoginTenantOtp = async ({ email, phoneNumber }) => {
  try {
    const response = await apiClient.post('/send-otp', {
      email,
      phoneNumber,
    });

    if (response.status === 200 && response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to send OTP');
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// api/tenantAuth.js

export const verifyLoginTenantOtp = async ({ email, phoneNumber, otp }) => {
  try {
    const response = await apiClient.post('/verify-otp', {
      email,
      phoneNumber,
      otp,
    });

    if (response.status === 200 && response.data.success) {
      const { token, email, phoneNumber } = response.data.data;
      Cookies.set('accessToken', token, { expires: 1 });
      Cookies.set('email', email, { expires: 1 });
      Cookies.set('phoneNumber', phoneNumber, { expires: 1 });
      Cookies.set('userId', response.data.data.id);
      return response.data;
    } else {
      throw new Error(response.data.message || 'OTP verification failed');
    }
  } catch (error) {
    return handleApiError(error);
  }
};

// Change Password API
export const changePassword = (params) => async (dispatch) => {
  try {
    const payload = {
      currentPassword: encryptData(params.currentPassword),
      newPassword: encryptData(params.newPassword),
    };
    const response = await apiClient.post('/pass/update-password', payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Change Password API
export const resetPassword = (params) => async (dispatch) => {
  try {
    const payload = {
      token: params.token,
      newPassword: encryptData(params.newPassword),
    };
    const response = await apiClient.post('/pass/reset-password', payload);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Send Reset password link API
export const sendLink = (payload) => async (dispatch) => {
  try {
    const response = await apiClient.post(
      '/pass/send-reset-password-link',
      payload
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Captcha API
export const fetchCaptcha = async () => {
  try {
    const response = await apiClient.post(
      '/generate-captcha',
      { generate: 'captcha' },
      {
        headers: {
          skipAuth: true,
        },
      }
    );
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
