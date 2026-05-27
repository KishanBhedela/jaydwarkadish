const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  liter:       { type: String },
  dpPrice:     { type: Number },
  shellPrice:  { type: Number },
  stock:       { type: Number, default: 0 },
  images:      [{ type: String }],
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  company:     { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  tags:        [{ type: String }],
  isActive:    { type: Boolean, default: true },
  isFeatured:  { type: Boolean, default: false }
}, { timestamps: true });

// Full-text search index
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
