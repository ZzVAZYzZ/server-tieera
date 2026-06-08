const express = require("express");
const router = express.Router();
const { register, login,logout , current, googleAuthCallback, updatePassword, refresh, updateProfile, uploadAvatar, getAllUsersForChatting } = require("../../controllers/users.controller");
const { validateAccessToken } = require("../../middlewares/validateAccessToken");
const passport = require("passport");
const { validateRefreshToken } = require("../../middlewares/validateRefreshToken");
const upload = require("../../middlewares/uploadImage");
const { auth } = require("../../middlewares/auth");




// basic authentication
router.route('/users/register').post(register);
router.route('/users/login').post(login);
router.route('/users/logout').post(logout);
router.route('/users/current').get(validateAccessToken,current);
router.route('/users/refresh').get(validateRefreshToken,refresh);
router.route('/users/profile').put(validateAccessToken, updateProfile);
router.route('/users/avatar').post(validateAccessToken, upload.single("avatar"), uploadAvatar);
router.route('/users/getAllUsers').get(validateAccessToken,auth(['admin']),getAllUsersForChatting);

// Oauth 2.0 authentication
router.route("/users/google").get(passport.authenticate("google", { scope: ["profile", "email"] }));
router.route("/users/google/callback").get(passport.authenticate("google", { session: false }),googleAuthCallback);
router.route("/users/update-password").put(validateAccessToken,updatePassword);


module.exports = router;
