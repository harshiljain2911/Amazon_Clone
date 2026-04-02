import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import { Users, ShoppingBag, DollarSign, Package } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await adminApi.get('/dashboard');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div className="p-10 text-center font-semibold text-lg text-gray-600">Loading Dashboard...</div>;
  }

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: <DollarSign size={24} className="text-green-600" />, bg: 'bg-green-100' },
    { title: 'Total Orders', value: stats.totalOrders, icon: <ShoppingBag size={24} className="text-blue-600" />, bg: 'bg-blue-100' },
    { title: 'Total Products', value: stats.totalProducts, icon: <Package size={24} className="text-orange-600" />, bg: 'bg-orange-100' },
    { title: 'Total Users', value: stats.totalUsers, icon: <Users size={24} className="text-purple-600" />, bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f1111]">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => (
          <div key={i} className="amz-box p-5 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{c.title}</p>
              <h3 className="text-2xl font-bold text-[#0f1111]">{c.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${c.bg}`}>
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="amz-box shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-[#ddd] bg-gray-50">
          <h2 className="text-lg font-bold text-[#0f1111]">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f3f3f3] text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 font-semibold">Order ID</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 && (
                <tr><td colSpan="5" className="px-5 py-4 text-center">No orders found.</td></tr>
              )}
              {stats.recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-[#eee] hover:bg-gray-50">
                  <td className="px-5 py-4 font-mono text-xs">{order._id}</td>
                  <td className="px-5 py-4">{order.user?.name || 'Unknown'}</td>
                  <td className="px-5 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 font-semibold text-[#B12704]">₹{order.totalAmount}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
