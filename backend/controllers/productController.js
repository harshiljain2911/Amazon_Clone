import {
  getProductsService,
  getProductByIdService,
  addReviewService,
} from '../services/productService.js';

/* ── GET /api/products ── */
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, brand, minPrice, maxPrice, sort, featured, page, limit } = req.query;

    const result = await getProductsService({
      search,
      category,
      brand,
      minPrice: minPrice   ? Number(minPrice)   : 0,
      maxPrice: maxPrice   ? Number(maxPrice)   : Infinity,
      sort,
      featured: featured   === 'true',
      page:  page  ? Number(page)  : 1,
      limit: limit ? Number(limit) : 20,
    });

    res.status(200).json(result.products); // backward compat — raw array
    // New clients can use ?page, ?limit and get: { products, page, pages, total }
    // To enable pagination headers: res.set('X-Total-Count', result.total)
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/products/:id ── */
export const getProductById = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(err.status || 500);
    next(err);
  }
};

/* ── POST /api/products/:id/reviews ── */
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await addReviewService(
      req.params.id,
      req.user._id,
      req.user.name,
      { rating, comment }
    );
    res.status(201).json({ success: true, message: 'Review submitted', product });
  } catch (err) {
    res.status(err.status || 500);
    next(err);
  }
};
