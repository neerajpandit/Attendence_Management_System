import Cookies from 'js-cookie';

// Common error handling function
export const handleApiError = async (error) => {
  if (error.response) {
    // If gets a action to logout the user
    if (error.response.data.action === 'LOGOUT_USER') {
      Cookies.remove('accessToken');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }

    // If there's a response from the server
    if (
      error.response.data.success === false ||
      error.response.data.status === false
    ) {
      return error.response.data;
    } else if (error.response.data.text) {
      // Handle error in case of blob
      const errorText = await error.response.data.text();
      if (errorText) {
        return JSON.parse(errorText);
      }
    } else {
      return {
        success: false,
        message: 'An unknown error occurred.',
      };
    }
  } else {
    // If there's no response (network error, etc.)
    return {
      success: false,
      message: 'Internal server error. Please try again later.',
    };
  }
};
