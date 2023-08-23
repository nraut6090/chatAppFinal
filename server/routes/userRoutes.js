const { registerController,loginController, setAvatarController, getAllUsers } =require("../controller/userController");
const router = require("express").Router();

router.post("/register",registerController);
router.post("/login",loginController);
router.post("/setAvatar/:id", setAvatarController);
router.get("/allusers/:id", getAllUsers);

module.exports=router;