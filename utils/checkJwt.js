const jwt = require("jsonwebtoken");

// middleware here
const checkJwt = (req, res, next) => {
  if (
    !req.headers.authorization ||
    req.headers.authorization.split(" ")[0] !== "Bearer"
  ) {
    return res.status(401).json({
      msg: "You are not authorized",
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      msg: "You are not authorized",
    });
  }
  // proccess.env.JWT_SECRET is coming from .env file
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  req.user_credentials = decoded;
  next();
};

module.exports = checkJwt;
