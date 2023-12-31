const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdminMiddleware } = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  fetchallUsers,
  updateprofile,
  logout,
  countallusers,
  userdetail,
  changepassword,
  verifyOTP,
  resetPassword,
  forgotpassword


} = require("../controllers/user");

router.put("/profile",isAuthenticated , updateprofile);
router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/alluser", fetchallUsers);
router.post("/logout", logout);
router.get('/countusers',isAdminMiddleware,countallusers )
router.get("/detail/:id", userdetail);
router.put("/changepassword/:id",isAuthenticated, changepassword);
router.post("/verify", verifyOTP);
router.post("/forgotpassword", forgotpassword);
router.post("/resetpassword", resetPassword);

module.exports = router;
