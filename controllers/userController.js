const { User } = require("../models/UserModel");
const mailer = require("../utils/mailer");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");

// register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "Please enter all fields",
      });
    }
    const userexists = await User.findOne({ email });
    if (userexists && userexists.active) {
      return res.status(400).json({
        msg: "User already exists please login",
      });
    }
    if (userexists && !userexists.active) {
      return res.status(400).json({
        msg: "User already exists please activate your account",
      });
    }
    let user = new User({
      name,
      email,
      password,
    });
    //     const token = generateToken(user);
    // generate 28 bit code to be sent to user
    crypto.randomBytes(28, async (err, buffer) => {
      // Ensure the code is unique
      user.activeToken = user._id + buffer.toString("hex");
      user.activeTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
      var link =
        "development" === process.env.NODE_ENV
          ? `http://localhost:${process.env.PORT}/api/users/activate/${user.activeToken}`
          : `https://${process.env.api_host}/api/users/activate/${user.activeToken}`;

      // send email to user
      await mailer.send({
        from: "" + process.env.EMAIL,
        to: user.email,
        subject: "Activate your account",
        html: `<h1>Activate your account</h1>
               <p>Please click on the link to activate your account</p>
               <a href="${link}">Link</a>`,
      });
      user = await user.save();
    });

    res.status(201).json({
      success: true,
      msg:
        "Account created successfully please check your email to activate your account" +
        user.email,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error registering user",
      error: error.msg,
    });
  }
};

// activate user account
const activateUser = async (req, res) => {
  try {
    const activeToken = req.params.activeToken;
    if (!activeToken) {
      return res.status(400).json({
        success: false,
        msg: "No active token provided",
      });
    }
    const user = await User.findOne({ activeToken });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Invalid token or user does not exist",
      });
    }
    if (user.active === true) {
      return res.status(400).json({
        success: false,
        msg: "User already activated",
      });
    }

    if (user.activeTokenExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        msg: "Token expired",
      });
    }
    user.active = true;
    await user.save();
    res.status(200).json({
      success: true,
      msg: "Account activated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error activating user",
      error: error.msg,
    });
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Please enter all fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "User does not exist",
      });
    }
    if (user.active === false) {
      return res.status(400).json({
        success: false,
        msg: "User not activated please activate your account ",
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        msg: "Invalid password",
      });
    }
    const token = generateToken({ _id: user._id });
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        active: user.active,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error logging in user",
      error: error.msg,
    });
  }
};

// get user profile
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.header._id).select("-password");

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        active: user.active,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting user",
      error: error.msg,
    });
  }
};

// logout user
const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.header._id);
    res.status(200).json({
      success: true,
      msg: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error logging out user",
      error: error.msg,
    });
  }
};

// update user profile
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.header._id);
    const { name, avatar } = req.body;
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    await user.save();
    // generate token again to update the header
    const token = generateToken({ _id: user._id });

    res.status(200).json({
      success: true,
      msg: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        active: user.active,
        token: token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating user",
      error: error.msg,
    });
  }
};

module.exports = {
  registerUser,
  activateUser,
  loginUser,
  getUser,
  logoutUser,
  updateUser,
};
