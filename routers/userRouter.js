const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register

router.post("/", async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;

    // validation

    if (!email || !password || !passwordVerify)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    if (password.length < 8)
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 8 characters.",
      });

    if (password !== passwordVerify)
      return res.status(400).json({
        errorMessage: "Please enter the same password twice.",
      });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        errorMessage: "An account with this email already exists.",
      });

    // hash the password

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // save a new user account to the db

    const newUser = new User({
      email,
      passwordHash,
    });
    // is return data and we can get the item's in hare
    const savedUser = await newUser.save();

    // sign the token

    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      // jwt secertkey 
      process.env.JWT_SECERTKEY
    );

    // send the token in a HTTP-only cookie
    // res.cookie("token",  token, {
    //   httpOnly: true,
    //   // when i use secure is not return data and iwant to now 
    //   //secure: true,
    //   sameSite: "none",
    // }).send();
    res.json({
      token,
    })

  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// log in

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate for login
    // 400 is bad request
    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });

    // Search for user if no exist , 401 for  wronge password
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(401).json({ errorMessage: "Wrong email or password." });

    const passwordCorrect = await bcrypt.compare(
      password,
      // it get the same password email
      existingUser.passwordHash
    );
    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: "Wrong email or password." });

    // sign the token
    // get token for another time it not requied to login just login eith token

    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECERTKEY
    );

    // send the token in a HTTP-only cookie
    // res.cookie("token",  token, {
    //     httpOnly: true,
    //     // when i use secure is not return data and iwant to now 
    //     //secure: true,
    //     sameSite: "none",
    //   }).send();
    res.json({
      token,
    })

  } catch (err) {
    console.error(err); 
    res.status(500).send();
  }
});
// to logout the program
router.get("/logout", (req, res) => {
  // res.cookie("token", "", {
  //     httpOnly: true,
  //     // cookie is expired
  //     expires: new Date(0),
  //     secure: true,
  //     sameSite: "none",
  //   }).send();
});

// check userif before logged
router.get("/loggedin", (req, res) => {
   try {
    const token = req.headers.authorization.replace('"','').replace('"','');  
    console.log(token+"sd")
    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECERTKEY);

    res.send(true);
   } catch (err) {
     res.json(false);
   }
});

module.exports = router;
