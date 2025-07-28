import jwt from 'jsonwebtoken';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined; // Don't include the hashed password in the response

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ), // Remove the cookie from the browser after this time
    httpOnly: true,
    sameSite: 'Lax', // Limits cookie to same-site requests for CSRF protection
    secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    user,
  });
};

export default createSendToken;
