const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const Admin = require('./models/Admin');

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/upload', require('./routes/upload'));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopdb';
// Basic validation so deployments fail with a clear message instead of a cryptic MongoParseError
if (!/^mongodb(\+srv)?:\/\//i.test(mongoUri)) {
  console.error('❌ Invalid MONGODB_URI. It must start with "mongodb://" or "mongodb+srv://".\nCurrent value:', mongoUri);
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    try {
      const exists = await Admin.findOne({ email: 'admin@shop.com' });
      if (!exists) {
        await Admin.create({ username: 'admin', email: 'admin@shop.com', password: 'admin123' });
        console.log('✅ Auto-seeded Admin: admin@shop.com / admin123');
      }
    } catch (err) {
      console.error('❌ Auto-seed Error:', err);
    }
  })
  .catch(err => console.error('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Ensure uploads directory exists
const fs = require('fs');
const uploadsDir = require('path').join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
