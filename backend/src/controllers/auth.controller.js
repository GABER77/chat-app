import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.js';
import filterObject from '../utils/filterObject.js';
import createSendToken from '../utils/token.js';
import CustomError from '../utils/customError.js';

const signUp = catchAsync(async (req, res, next) => {
  // Filter only allowed fields from the request body
  const filteredBody = filterObject(
    req.body,
    'name',
    'email',
    'profileImage',
    'password',
    'passwordConfirm'
  );

  // Create a new user with the filtered data
  const newUser = await User.create(filteredBody);

  // Generate JWT token and send response
  createSendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError('Please enter your email and password', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    throw new CustomError('Invalid Credentials', 401);
  }

  createSendToken(user, 200, res);
});

const logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now() + 10 * 1000), // 10 seconds
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

const authController = {
  signUp,
  login,
  logout,
};

export default authController;
