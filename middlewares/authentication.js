const {verifyToken} = require('../services/authentication');

function checkAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
       next(); // No token, proceed to next middleware
    }

    try {
      const payload = verifyToken(tokenCookieValue);
      req.user = payload; // Attach user info to request object
    } catch (error) {
      console.error('Token verification failed:', error);
    }
    next();
  };
}

module.exports = { checkAuthenticationCookie };
