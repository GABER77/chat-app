import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.js';
import CustomError from '../utils/customError.js';

const updateMe = catchAsync(async (req, res, next) => {});

const userController = {
  updateMe,
};

export default userController;
