export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const handleApiError = (error, defaultMessage = 'Operation failed') => {
  const message = getErrorMessage(error);
  console.error('API Error:', error);
  return message || defaultMessage;
};