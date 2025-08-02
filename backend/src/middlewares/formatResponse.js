// Middleware to format all JSON responses in a consistent structure
const formatResponse = (req, res, next) => {
  // Save the original res.json function so we can still call it later
  const originalJson = res.json.bind(res);

  // Override res.json
  res.json = (body) => {
    const { status, ...data } = body;

    const formatted = {
      apiVersion: process.env.API_VERSION || 'unknown',
      status: status || 'unknown',
      data: data,
    };

    return originalJson(formatted);
  };

  next();
};

export default formatResponse;
