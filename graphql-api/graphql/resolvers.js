const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

module.exports = {
  // on peut récupérer l'email de cette façon et il faut return le User.findOne() si on utilise then()

  //   createUser:(args, req) {
  //     const email = args.userInput.email;
  //     return User.findOne().then()...
  //   }

  // ou de manière destructurée comme ci desssous
  createUser: async function ({ userInput }, req) {
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User exists already');
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
};
