import catchAsync from '../utils/catchAsync.js';
import filterObject from '../utils/filterObject.js';

const signUp = catchAsync(async (req, res, next) => {
  const filteredBody = filterObject(
    req.body,
    'name',
    'email',
    'profileImage',
    'password',
    'passwordConfirm'
  );
  const newUser = await User.create(filteredBody);
});

const authController = {
  signUp,
};

export default authController;
