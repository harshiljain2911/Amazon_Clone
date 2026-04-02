import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:    { type: String, required: true },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    /* ── Core ── */
    name:        { type: String, required: true, trim: true },
    description: { type: String, required: true },
    brand:       { type: String, required: true, trim: true },
    category:    { type: String, required: true, trim: true },
    subCategory: { type: String, trim: true, default: '' },

    /* ── Pricing ── */
    price:         { type: Number, required: true, default: 0 },
    discountPrice: { type: Number, default: null },   // sale price; null = no sale

    /* ── Images ── */
    image:  { type: String, required: true },          // primary image (backward compat)
    images: [{ type: String }],                        // additional images

    /* ── Inventory ── */
    countInStock: { type: Number, required: true, default: 0 },

    /* ── Ratings ── */
    reviews:    [reviewSchema],
    rating:     { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    /* ── Discovery ── */
    tags:       [{ type: String }],
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ── Text index for search ── */
productSchema.index(
  { name: 'text', brand: 'text', description: 'text', tags: 'text' },
  { weights: { name: 10, brand: 5, tags: 3, description: 1 } }
);

/* ── Compound indexes for filter/sort performance ── */
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
