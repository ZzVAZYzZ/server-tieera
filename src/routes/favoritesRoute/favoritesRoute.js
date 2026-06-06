const express = require("express");
const router = express.Router();
const { validateAccessToken } = require("../../middlewares/validateAccesstoken");
const { auth } = require("../../middlewares/auth");
const { favoriteProduct, unFavoriteProduct, getUserFavorites } = require("../../controllers/favorite.controller");

// basic admin block feature
router.route("/favorites/favoriteProduct/").post(validateAccessToken, auth(["user","admin"]), favoriteProduct);
router.route("/favorites/unFavoriteProduct/").delete(validateAccessToken, auth(["user","admin"]), unFavoriteProduct);
router.route("/favorites/getUserFavorites/").get(validateAccessToken, auth(["user","admin"]), getUserFavorites);

module.exports = router;
