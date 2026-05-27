const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.test(ext)) cb(null, true);
  else cb(new Error('Only image files allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/upload/single
router.post('/single', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});

// POST /api/upload/multiple
router.post('/multiple', auth, upload.array('images', 10), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ message: 'No files uploaded' });
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ urls });
});

module.exports = router;
