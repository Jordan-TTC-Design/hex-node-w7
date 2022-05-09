const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, '請輸入您的名字'],
    },
    email: {
      type: String,
      require: [true, '請輸入您的email'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: [true, '請輸入您的password'],
      select: false,
    },
    age: {
      type: Number,
      default: 1,
    },
    gender: {
      type: String,
      require: [true, '請輸入您的性別'],
      default: 'male',
    },
    photo: {
      type: String,
      default: '',
    },
    passwordReset: {
      title: {
        type: String,
        default: '',
      },
      answer: { type: String, select: false },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

const User = mongoose.model('user', userSchema);

module.exports = User;
