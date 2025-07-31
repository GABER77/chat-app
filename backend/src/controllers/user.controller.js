import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.js';
import CustomError from '../utils/customError.js';

const updateMe = catchAsync(async (req, res, next) => {
  // 1) Check if the user didn't provide data to update
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new CustomError(
      'Request body is empty. Please provide data to update.',
      400
    );
  }

  // 2) Create error if user post a password data
  if (req.body.password || req.body.passwordConfirm) {
    throw new CustomError(
      'This route is not for password update, Please use / update-password',
      400
    );
  }

  // 3) Keep only allowed fields for update (filter out all others)
  const filteredBody = filterObject(
    req.body,
    'name',
    'email',
    'cloudinaryFolder',
    'image'
  );

  // 4) Update user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true, // validate the fields being updated
  });

  res.status(200).json({
    status: 'success',
    updatedUser,
  });
});

const userController = {
  updateMe,
};

export default userController;
