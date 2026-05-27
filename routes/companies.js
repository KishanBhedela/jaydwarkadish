const router = require('express').Router();
const Company = require('../models/Company');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true }).sort({ name: 1 });
    res.json(companies);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/all', auth, async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found' });
    res.json(company);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json(company);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(company);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
