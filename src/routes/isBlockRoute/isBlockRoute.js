const express = require("express");
const router = express.Router();
const { blockUser, unblockUser, getBlockStatus, getAllBlockedUsers, } = require("../../controllers/isBlock.controller");
const { validateAccessToken } = require("../../middlewares/validateAccessToken");
const { auth } = require("../../middlewares/auth");

// basic admin block feature
router.route("/isBlock/blocked").get(validateAccessToken, auth(["admin"]), getAllBlockedUsers);
router.route("/isBlock/:userId/block-status").get(validateAccessToken, auth(["admin"]), getBlockStatus);
router.route("/isBlock/:userId/block").post(validateAccessToken, auth(["admin"]), blockUser);
router.route("/isBlock/:userId/unblock").post(validateAccessToken, auth(["admin"]), unblockUser);

module.exports = router;
