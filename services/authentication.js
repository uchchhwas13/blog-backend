const JWT = require('jsonwebtoken');
const secret = 'cefalo@123';

function generateTokenForUser(user) {
  const payload = {
    id: user._id,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  return JWT.sign(payload, secret);
}

function verifyToken(token) {
  const payload = JWT.verify(token, secret);
  return payload;
  // TODO: Need to handle errors properly
  //   try {
  //     return JWT.verify(token, secret);
  //   } catch (error) {
  //     return null;
  //   }
}

module.exports = {
  generateTokenForUser,
  verifyToken,
};
