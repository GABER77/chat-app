import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    validate: [validator.isEmail, 'Please enter a valid email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  profileImage: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, // Don't return password in queries
    validate: {
      validator: function (val) {
        // Must have at least 1 uppercase letter and 1 special character
        return /(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(val);
      },
      message:
        'Password must contain at least one uppercase letter and one special character',
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on `create` and `save`, not on update
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  cloudinaryPath: {
    type: String,
  },
  passwordChangedAt: Date,
});

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Set passwordChangedAt when the user changes his password
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Exclude the fields from all find queries (find, findOne, findAll, etc.)
userSchema.pre(/^find/, function (next) {
  this.select('-__v');
  next();
});

// Instance method: available in all document in a certain collection
userSchema.methods.checkPassword = async function (
  givenPassword,
  storedPassword
) {
  return await bcrypt.compare(givenPassword, storedPassword);
};

userSchema.methods.isPasswordChangedAfter = function (JWTIssuedAt) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTIssuedAt < changedTimeStamp;
  }
  // False means password not changed.
  return false;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
