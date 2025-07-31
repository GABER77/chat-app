import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.js';
import CustomError from '../utils/customError.js';
import jwt from 'jsonwebtoken';

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

export default protect;
