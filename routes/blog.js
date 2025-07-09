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

router.post('/', (req, res) => {
    console.log('Request body for adding blog', req.body);
    return res.redirect('/');
});


module.exports = router;