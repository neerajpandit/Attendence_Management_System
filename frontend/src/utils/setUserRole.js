// Function to set userRole
export const setUserRole = (role) => {
  if (role === '1') {
    return 'Organization';
  } else if (role === '2') {
    return 'Staff';
  } else {
    return 'Super Admin';
  }
};
