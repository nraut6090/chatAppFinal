const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

module.exports.registerController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already taken", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.loginController = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect username or password", status: false });
    const isPassowrdCorrect = await bcrypt.compare(password,user.password);
    if (!isPassowrdCorrect)
      return res.json({ msg: "Incorrect username or password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};


module.exports.setAvatarController = async (req, res, next) => {
  try {
   const userId=req.params.id;
   const avatarImage=req.body.image;
   const userdata=await User.findByIdAndUpdate(userId,{
    isAvatarImageSet:true,
    avatarImage,
   },
   { new: true }
   );
   return res.json({
    isSet:userdata.isAvatarImageSet,
    image:userdata.avatarImage
   })

  } catch (ex) {
    next(ex);
  }
};


module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};