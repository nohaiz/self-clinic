// FUNCTION TO CREATE A TOKEN FOR THE USER
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const token = jwt.sign({ type: user }, process.env.JWT_SECRET);
  return token;
};

module.exports = createToken;
