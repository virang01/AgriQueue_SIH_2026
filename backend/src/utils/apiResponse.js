export const sendResponse = (res, statusCode, success, message, data = null, error = null) => {
  const responseObj = {
    success,
    message,
    data,
    error,
  };

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    Object.assign(responseObj, data);
  }

  return res.status(statusCode).json(responseObj);
};

export const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data, null);
};

export const sendError = (res, message = 'Error', error = null, statusCode = 400) => {
  return sendResponse(res, statusCode, false, message, null, error);
};
