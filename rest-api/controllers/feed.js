const { validationResult } = require('express-validator/check');

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
    return res
      .status(422)
      .json({
        message: 'Validation failed, entered data is incorrect.',
        errors: errors.array()
      });
  }
  const title = req.body.title;
  const content = req.body.content;
  // Create post in db
  // 201 = "success a ressource is created"
  res.status(201).json({
    message: 'Post created successfully!',
    post: {
      _id: new Date().getTime(),
      title: title,
      content: content,
      creator: { name: 'Jérémy' },
      createdAt: new Date()
    }
  });
};
