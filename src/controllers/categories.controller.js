const asyncHandler = require('express-async-handler');
const Category = require('../models/categories');

// @desc Create new category
// @route POST /api/categories/create
// @access  Private/Admin
//@param {name}
//@result { message, category }
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required.');
  }

  // Check if category with same name exists (optional)
  const existingCategory = await Category.findOne({ where: { name } });
  if (existingCategory) {
    res.status(400);
    throw new Error('Category with this name already exists.');
  }

  const category = await Category.create({ name });

  res.status(201).json({
    message: 'Category created successfully',
    category,
  });
});

// @desc Get all categories
// @route GET /api/categories/getAll
// @access Public
//@param null
//@result category 
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll();
  res.status(200).json(categories);
});

// @desc Get category by ID
// @route GET /api/categories/:id
// @access Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found.');
  }

  res.status(200).json(category);
});

// @desc Update category by ID
// @route PUT /api/categories/:id
// @access Private/Admin
//@param null
//@result {message, category} 
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found.');
  }

  const { name } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Category name is required.');
  }

  category.name = name;
  await category.save();

  res.status(200).json({
    message: 'Category updated successfully',
    category,
  });
});

// @desc Delete category by ID
// @route DELETE /api/categories/:id
// @access Private/Admin
//@param null
//@result {message} 
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found.');
  }

  await category.destroy();

  res.status(200).json({
    message: 'Category deleted successfully',
  });
});

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
