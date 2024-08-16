// FUNCTION TO CREATE A TOKEN FOR THE USER
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const token = user._id
    ? jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    : jwt.sign({ user }, process.env.JWT_SECRET);
  return token;
};

module.exports = createToken;
