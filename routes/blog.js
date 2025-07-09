const { Router } = require('express');

const router = Router();

router.get('/add-new', (req, res) => {
  if (!req.user) {
    return res.redirect('/user/signin');
  }
  
  return res.render('addBlog', {
    user: req.user
  });
});


module.exports = router;