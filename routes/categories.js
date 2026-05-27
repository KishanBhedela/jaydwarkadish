const router = require('express').Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');

// Public - all active categories, optionally filtered by company
router.get('/', async (req, res) => {
  try {
    const query = { isActive: true };
    if (req.query.company) query.company = req.query.company;
    const categories = await Category.find(query).populate('company', 'name').sort({ name: 1 });
    res.json(categories);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin - all categories
router.get('/all', auth, async (req, res) => {
  try {
    const query = {};
    if (req.query.company) query.company = req.query.company;
    const categories = await Category.find(query).populate('company', 'name').sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const cat = new Category(req.body);
    await cat.save();
    res.status(201).json(cat);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(cat);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
