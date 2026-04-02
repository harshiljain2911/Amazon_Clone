import Product from '../models/productModel.js';

/**
 * Get products with full filtering, sorting, search, and pagination.
 *
 * @param {Object} params
 * @param {string}  params.search      - text search keyword
 * @param {string}  params.category    - category filter
 * @param {string}  params.brand       - brand filter
 * @param {number}  params.minPrice    - minimum price
 * @param {number}  params.maxPrice    - maximum price
 * @param {string}  params.sort        - 'price_asc' | 'price_desc' | 'rating' | 'newest'
 * @param {boolean} params.featured    - only featured products
 * @param {number}  params.page        - page number (1-based)
 * @param {number}  params.limit       - items per page
 * @returns {{ products, page, pages, total }}
 */
export const getProductsService = async ({
  search    = '',
  category  = '',
  brand     = '',
  minPrice  = 0,
  maxPrice  = Infinity,
  sort      = 'newest',
  featured  = false,
  page      = 1,
  limit     = 20,
} = {}) => {
  const query = {};

  /* ── Text search ── */
  if (search) {
    query.$or = [
      { name:        { $regex: search, $options: 'i' } },
      { brand:       { $regex: search, $options: 'i' } },
      { category:    { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  /* ── Filters ── */
  if (category) query.category = { $regex: `^${category}$`, $options: 'i' };
  if (brand)    query.brand    = { $regex: `^${brand}$`,    $options: 'i' };
  if (featured) query.isFeatured = true;

  /* ── Price range ── */
  if (minPrice || maxPrice !== Infinity) {
    query.price = {};
    if (minPrice)          query.price.$gte = Number(minPrice);
    if (maxPrice !== Infinity) query.price.$lte = Number(maxPrice);
  }

  /* ── Sort ── */
  const sortMap = {
    price_asc:  { price:  1 },
    price_desc: { price: -1 },
    rating:     { rating: -1 },
    newest:     { createdAt: -1 },
  };
  const sortOption = sortMap[sort] || sortMap.newest;

  /* ── Pagination ── */
  const pageNum  = Math.max(1, Number(page));
  const pageSize = Math.min(50, Math.max(1, Number(limit)));
  const skip     = (pageNum - 1) * pageSize;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sortOption).skip(skip).limit(pageSize).lean(),
    Product.countDocuments(query),
  ]);

  return {
    products,
    page:  pageNum,
    pages: Math.ceil(total / pageSize),
    total,
  };
};

/* ── Single product ── */
export const getProductByIdService = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw Object.assign(new Error('Product not found'), { status: 404 });
  }
  return product;
};

/* ── Create product (admin) ── */
export const createProductService = async (data) => {
  const product = await Product.create(data);
  return product;
};

/* ── Update product (admin) ── */
export const updateProductService = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new:              true,
    runValidators:    true,
  });
  if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
  return product;
};

/* ── Delete product (admin) ── */
export const deleteProductService = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });
  return product;
};

/* ── Add review ── */
export const addReviewService = async (productId, userId, userName, { rating, comment }) => {
  const product = await Product.findById(productId);
  if (!product) throw Object.assign(new Error('Product not found'), { status: 404 });

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === userId.toString()
  );
  if (alreadyReviewed) throw Object.assign(new Error('Product already reviewed'), { status: 400 });

  product.reviews.push({ user: userId, name: userName, rating: Number(rating), comment });
  product.numReviews = product.reviews.length;
  product.rating     = product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

  await product.save();
  return product;
};
