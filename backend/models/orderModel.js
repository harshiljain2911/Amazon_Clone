import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name:     { type: String, required: true },     // snapshot at order time
    image:    { type: String, required: true },
    price:    { type: Number, required: true },     // price snapshot
    qty:      { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName:    { type: String, required: true },
    phone:       { type: String, required: true },
    addressLine: { type: String, required: true },
    city:        { type: String, required: true },
    state:       { type: String, required: true },
    pincode:     { type: String, required: true },
    country:     { type: String, default: 'India' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    orderItems: [orderItemSchema],

    shippingAddress: shippingAddressSchema,

    paymentMethod: {
      type:    String,
      required: true,
      enum:    ['COD', 'UPI', 'Card', 'NetBanking', 'Wallet', 'Razorpay'],
      default: 'COD',
    },

    /* ── Pricing totals ── */
    itemsPrice:    { type: Number, required: true, default: 0 },
    taxPrice:      { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalAmount:   { type: Number, required: true, default: 0 },

    /* ── Payment ── */
    isPaid:   { type: Boolean, default: false },
    paidAt:   { type: Date },
    paymentId:{ type: String },
    paymentResult: {
      id:     String,
      status: String,
      updateTime: String,
      emailAddress: String,
    },

    /* ── Fulfillment ── */
    orderStatus: {
      type:    String,
      enum:    ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    isDelivered:  { type: Boolean, default: false },
    deliveredAt:  { type: Date },

    trackingNumber: { type: String, default: null },
  },
  { timestamps: true }
);

/* ── Indexes ── */
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
