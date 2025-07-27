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
  cloudinaryFolder: {
    type: String,
    default: '',
  },
  passwordChangedAt: Date,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
