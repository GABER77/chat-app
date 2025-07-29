// Middleware to format all JSON responses in a consistent structure
const formatResponse = (req, res, next) => {
  // Save the original res.json function so we can still call it later
  const originalJson = res.json.bind(res);

  // Override res.json
  res.json = (data) => {
    const formatted = {
      apiVersion: process.env.API_VERSION || 'unknown',
      data,
    };

    return originalJson(formatted);
  };

  next();
};

export default formatResponse;
