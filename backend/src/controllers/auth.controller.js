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

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting the token
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token is found, deny access
  if (!token) {
    throw new CustomError('Please login to get access', 401);
  }

  // 2) Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists: Maybe he deleted his account
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    throw new CustomError('This user is no longer exists', 401);
  }

  // 4) Check if user changed his password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    throw new CustomError(
      'User recently changed password, Please login again',
      401
    );
  }

  // All checks passed, attach user object to request
  req.user = currentUser;
  next();
});

const authController = {
  signUp,
  login,
  logout,
  protect,
};

export default authController;
