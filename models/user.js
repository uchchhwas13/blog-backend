const {createHmac, randomBytes} = require("crypto")
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: '/images/default.jpg',
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
const user = this;
  if (!user.isModified('password'))
    return next();

  const salt = randomBytes(16).toString('hex');
  const hasedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');

  this.salt = salt;
  this.password = hasedPassword;
  next();
});

const User = model('User', userSchema);
module.exports = User;
