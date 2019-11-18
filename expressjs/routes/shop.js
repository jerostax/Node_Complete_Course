const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("In another middleware!");
  // send() nous autorise à renvoyer une réponse (avec un body de type any)
  res.send("<h1>Hello from Express</h1>");
});

module.exports = router;
