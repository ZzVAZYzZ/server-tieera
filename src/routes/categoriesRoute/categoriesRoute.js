const express = require("express");
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require("../../controllers/categories.controller");
const { validateAccessToken } = require("../../middlewares/validateAccesstoken");
const router = express.Router();
const {auth} = require('../../middlewares/auth');

router.route('/categories/create').post(validateAccessToken,auth(["admin"]),createCategory);
router.route('/categories/getAll').get(validateAccessToken,auth(["admin"]),getCategories);
router.route('/categories/:id').get(validateAccessToken,auth(["admin"]),getCategoryById);
router.route('/categories/:id').put(validateAccessToken,auth(["admin"]),updateCategory);
router.route('/categories/:id').delete(validateAccessToken,auth(["admin"]),deleteCategory);


module.exports = router;