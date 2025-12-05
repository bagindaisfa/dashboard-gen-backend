export const success = (res, data = null, message = "OK", status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};
