import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.js';
import filterObject from '../utils/filterObject.js';
import createSendToken from '../utils/token.js';

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

const authController = {
  signUp,
};

export default authController;
