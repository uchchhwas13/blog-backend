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

userSchema.methods.generateAccessToken = function (this: IUser): string {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiryDuration = 2 * 60;

  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined');
  }

  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      name: this.name,
      role: this.role,
    },
    secret,
    { expiresIn: expiryDuration },
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const expiryDuration = 60 * 60;

  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined');
  }
  return jwt.sign(
    {
      _id: this._id,
    },
    secret,
    {
      expiresIn: expiryDuration,
    },
  );
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
