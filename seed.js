const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopdb');
  const exists = await Admin.findOne({ email: 'admin@shop.com' });
  if (!exists) {
    await Admin.create({ username: 'admin', email: 'admin@shop.com', password: 'admin123' });
    console.log('✅ Admin created: admin@shop.com / admin123');
  } else {
    console.log('ℹ️ Admin already exists: admin@shop.com / admin123');
  }
  await mongoose.disconnect();
}
seed().catch(console.error);
