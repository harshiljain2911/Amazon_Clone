import 'dotenv/config'; // ES6 hoisting safeguard: loads .env before ANY other imports run.
import express       from 'express';
import cors          from 'cors';
import helmet        from 'helmet';
import cookieParser  from 'cookie-parser';
import rateLimit     from 'express-rate-limit';
import connectDB     from './config/db.js';
import { initCloudinary } from './config/cloudinary.js';

/* ── Routes ──────────────────────────────────────────────── */
import authRoutes           from './routes/authRoutes.js';
import productRoutes        from './routes/productRoutes.js';
import cartRoutes           from './routes/cartRoutes.js';
import wishlistRoutes       from './routes/wishlistRoutes.js';
import orderRoutes          from './routes/orderRoutes.js';
import adminRoutes          from './routes/adminRoutes.js';
import userRoutes           from './routes/userRoutes.js';
import activityRoutes       from './routes/activityRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import uploadRoutes         from './routes/uploadRoutes.js';
import paymentRoutes        from './routes/paymentRoutes.js';

/* ── Error handlers ──────────────────────────────────────── */
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

/* ── Bootstrap ───────────────────────────────────────────── */
connectDB();
initCloudinary();

const app = express();

/* ══════════════════════════════════════════════════════════
   SECURITY MIDDLEWARE
══════════════════════════════════════════════════════════ */
app.use(helmet());

app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,   // allow cookies cross-origin
}));

/* ── Rate limiters ── */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max:      200,
  message:  { success: false, message: 'Too many requests — please try again later.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 min
  max:      50,
  message:  { success: false, message: 'Too many auth attempts — wait 10 minutes.' },
});

app.use(globalLimiter);

/* ══════════════════════════════════════════════════════════
   BODY / COOKIE PARSING
══════════════════════════════════════════════════════════ */
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ══════════════════════════════════════════════════════════
   HEALTH CHECK
══════════════════════════════════════════════════════════ */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/* ══════════════════════════════════════════════════════════
   API ROUTES
══════════════════════════════════════════════════════════ */
app.use('/api/auth',             authLimiter, authRoutes);
app.use('/api/products',         productRoutes);
app.use('/api/cart',             cartRoutes);
app.use('/api/wishlist',         wishlistRoutes);
app.use('/api/orders',           orderRoutes);
app.use('/api/admin',            adminRoutes);
app.use('/api/users',            userRoutes);
app.use('/api/activity',         activityRoutes);
app.use('/api/recommendations',  recommendationRoutes);
app.use('/api/upload',           uploadRoutes);
app.use('/api/payment',          paymentRoutes);

/* ══════════════════════════════════════════════════════════
   ERROR HANDLING (must be last)
══════════════════════════════════════════════════════════ */
app.use(notFound);
app.use(errorHandler);

/* ══════════════════════════════════════════════════════════
   SERVER START
══════════════════════════════════════════════════════════ */
let PORT = Number(process.env.PORT) || 5000;

const startServer = () => {
  const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${PORT} busy — trying ${PORT + 1}`);
      PORT++;
      startServer();
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  /* Graceful shutdown */
  process.on('SIGTERM', () => {
    console.log('SIGTERM received — shutting down gracefully');
    server.close(() => process.exit(0));
  });
};

startServer();
