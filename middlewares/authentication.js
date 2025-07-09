const {verifyToken} = require('../services/authentication');

function checkAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) {
       return next(); // No token, proceed to next middleware
    }

    try {
      const payload = verifyToken(tokenCookieValue);
      req.user = payload; 
    } catch (error) {
      console.error('Token verification failed:', error);
    }
    next();
  };
}

module.exports = { checkAuthenticationCookie };
