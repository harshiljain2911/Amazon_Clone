import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

export const getDashboardStatsService = async () => {
  const [
    totalUsers,
    totalOrders,
    totalProducts,
    recentOrders,
    revenueData
  ] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments(),
    Order.find({}).sort({ createdAt: -1 }).limit(5).populate('user', 'name email').lean(),
    Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ])
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  return {
    totalUsers,
    totalOrders,
    totalProducts,
    totalRevenue,
    recentOrders,
  };
};

export const toggleUserBlockService = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  
  if (user.isAdmin) {
    throw Object.assign(new Error('Cannot block an admin user. Remove admin role first.'), { status: 400 });
  }

  user.isBlocked = !user.isBlocked;
  await user.save({ validateBeforeSave: false });
  return user;
};
