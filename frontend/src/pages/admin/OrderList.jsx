import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await adminApi.get('/orders?limit=100');
      setOrders(data.orders || data); // handle depending on backend pagination wrap
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await adminApi.put(`/orders/${id}/status`, { orderStatus: status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0f1111]">Orders</h1>

      <div className="amz-box shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f3f3f3] text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 font-semibold">Order ID</th>
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Total Price</th>
                <th className="px-5 py-3 font-semibold">Payment</th>
                <th className="px-5 py-3 font-semibold text-right">Status Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="6" className="p-5 text-center">Loading...</td></tr>}
              {!loading && Array.isArray(orders) && orders.map((order) => (
                <tr key={order._id} className="border-b border-[#eee] hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs">{order._id}</td>
                  <td className="px-5 py-3">{order.user?.name || 'Deleted User'}</td>
                  <td className="px-5 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-[#B12704] font-semibold">₹{order.totalAmount}</td>
                  <td className="px-5 py-3">{order.paymentMethod}</td>
                  <td className="px-5 py-3 text-right">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className={`text-xs font-semibold px-2 py-1 rounded-md border focus:outline-none focus:ring-1 ${
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200 focus:ring-green-500' :
                        order.orderStatus === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200 focus:ring-blue-500' :
                        'bg-orange-100 text-orange-700 border-orange-200 focus:ring-orange-500'
                      }`}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
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

export default OrderList;
