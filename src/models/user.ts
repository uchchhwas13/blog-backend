import { createHmac, randomBytes } from 'crypto';
import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
require('dotenv').config();

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  salt: string;
  password: string;
  profileImageUrl?: string;
  role: 'USER' | 'ADMIN';
  refreshToken: string;
  matchPassword(user: IUser, password: string): void;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema<IUser>(
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
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = randomBytes(16).toString('hex');
  const hasedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

  this.salt = salt;
  this.password = hasedPassword;
  next();
});

userSchema.methods.matchPassword = function (user: IUser, password: string) {
  console.log('Matching password for email:', user.email);

  const userProvidedHash = createHmac('sha256', user.salt).update(password).digest('hex');
  console.log('Password matched for user:', userProvidedHash, user.password);
  if (userProvidedHash !== user.password) throw new Error('Incorrect password');
};

export const User = mongoose.model<IUser>('User', userSchema);

// userSchema.static(
//   'matchPasswordAndGenerateToken',
//   async function (email, password): Promise<string> {
//     console.log('Matching password for email:', email);
//     const user = await this.findOne({ email });
//     if (!user) throw new Error('User not found');

//     const salt = user.salt;
//     const hashedPassword = user.password;
//     const userProvidedHash = createHmac('sha256', salt).update(password).digest('hex');

//     if (userProvidedHash !== hashedPassword) throw new Error('Incorrect password');

//     const token = generateTokenForUser(user);
//     return token;
//   },
// );
