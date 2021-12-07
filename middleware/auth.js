const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

function auth(req, res, next) {
  try {
    // get token from  cookie
    const token = req.headers.authorization.replace('"','').replace('"','');  
    console.log(token)
    // if token not send show this 
    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });
    //it just see the token is made by the server or not 
    const verified = jwt.verify(token, process.env.JWT_SECERTKEY);
    // this one is usefull for taking a user to req.user and if we have data to store how many current user login to the website 
     req.user = verified.user;
    //when we want to close the auth file and return to prev file we call next (it mostly like close() but not same work )
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
}

module.exports = auth;


