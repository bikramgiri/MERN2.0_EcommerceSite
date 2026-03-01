const jwt = require("jsonwebtoken");

const generateToken = (user:any) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });
};

export default generateToken;
