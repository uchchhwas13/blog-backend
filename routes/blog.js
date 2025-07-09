const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
})

const upload = multer({ storage: storage });

router.get('/add-new', (req, res) => {
  if (!req.user) {
    return res.redirect('/user/signin');
  }
  
  return res.render('addBlog', {
    user: req.user
  });
});

router.post('/', upload.single('coverImage'), async(req, res) => {
    console.log('Request body for adding blog', req.body);
    console.log('Uploaded file:', req.file);

    const blog =  await Blog.create({
      title: req.body.title,
      body: req.body.body,
      coverImageUrl: `/uploads/${req.file.filename}`,
      createdBy: req.user._id
    })
    console.log('Blog created successfully', blog);
    return res.redirect(`/blog/${blog._id}`);
});

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  return res.render('blogDetails', {
    user: req.user,
    blog: blog
  });
});

module.exports = router;