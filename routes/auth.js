const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin already exists' });

    const admin = new Admin({ username, email, password });
    await admin.save();

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ token, admin: { id: admin._id, username, email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, admin: { id: admin._id, username: admin.username, email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
