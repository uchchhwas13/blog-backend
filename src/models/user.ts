import { createHmac, randomBytes } from 'crypto';
import mongoose, { Schema, Model } from 'mongoose';
import { generateTokenForUser } from '../services/authentication';

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  salt: string;
  password: string;
  profileImageUrl?: string;
  role: 'USER' | 'ADMIN';
}

const userSchema: Schema<IUser> = new Schema(
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

userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
  console.log('Matching password for email:', email);
  const user = await this.findOne({ email });
  if (!user) throw new Error('User not found');

  const salt = user.salt;
  const hashedPassword = user.password;
  const userProvidedHash = createHmac('sha256', salt).update(password).digest('hex');

  if (userProvidedHash !== hashedPassword) throw new Error('Incorrect password');

  const token = generateTokenForUser(user);
  return token;
});

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
