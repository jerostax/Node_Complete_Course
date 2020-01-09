const { validationResult } = require('express-validator/check');

const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: 'First post',
        content: 'this is the first post',
        imageUrl: 'images/chamonix.jpg',
        creator: {
          name: 'Jérémy'
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed, entered data is incorrect.',
      errors: errors.array()
    });
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: 'images/chamonix.jpg',
    creator: { name: 'Jérémy' }
  });
  post
    .save()
    .then(result => {
      console.log(result);
      // 201 = "success a ressource is created"
      res.status(201).json({
        message: 'Post created successfully!',
        post: result
      });
    })
    .catch(err => {
      console.log(err);
    });
};
