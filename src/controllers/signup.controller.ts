import { Request, Response } from 'express';
import { User } from '../models/user';

type SignupPayload = {
  fullname: string;
  email: string;
  password: string;
};

type SignupResponse = {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type ErrorResponse = {
  error: string;
};

export const handleSignup = async (
  req: Request<{}, {}, SignupPayload>,
  res: Response<SignupResponse | ErrorResponse>,
) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const result = await User.create({
      name: fullname,
      email,
      password,
    });

    return res.redirect('/');
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// import { Request, Response } from 'express';
// import { User } from '../models/user';

// type SignupPayload = {
//   fullname: string;
//   email: string;
//   password: string;
// };

// type SignupResponse = {
//   message: string;
//   user: {
//     id: string;
//     name: string;
//     email: string;
//   };
// };

// type ErrorResponse = {
//   error: string;
// };

// export const handleSignup = async (
//   req: Request<{}, {}, SignupPayload>,
//   res: Response<SignupResponse | ErrorResponse>,
// ) => {
//   try {
//     const { fullname, email, password } = req.body;

//     if (!fullname || !email || !password) {
//       return res.status(400).json({ error: 'All fields are required' });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ error: 'Email already registered' });
//     }

//     const result = await User.create({
//       name: fullname,
//       email,
//       password,
//     });

//     return res.status(201).json({
//       message: 'User registered successfully',
//       user: {
//         id: result._id.toString(),
//         name: result.name,
//         email: result.email,
//       },
//     });
//   } catch (error) {
//     console.error('Signup error:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };
