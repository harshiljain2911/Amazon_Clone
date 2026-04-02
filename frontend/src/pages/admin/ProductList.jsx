import React, { useState, useEffect } from 'react';
import axios from 'axios';
import adminApi from '../../services/adminApi';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      // Using public products endpoint heavily cached or standard DB query
      const { data } = await axios.get('/api/products?limit=100'); 
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminApi.delete(`/products/${id}`);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0f1111]">Products</h1>
        <Link to="/admin/products/create" className="amz-btn-primary px-4 py-2 flex items-center gap-2 text-sm max-w-fit shadow-md">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="amz-box shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-[#f3f3f3] text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Brand</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="7" className="p-5 text-center">Loading...</td></tr>}
              {!loading && products.map((product) => (
                <tr key={product._id} className="border-b border-[#eee] hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <img src={product.image} alt={product.name} className="w-12 h-12 object-contain" />
                  </td>
                  <td className="px-4 py-2 font-medium text-[#0f1111] max-w-xs truncate" title={product.name}>
                    {product.name}
                  </td>
                  <td className="px-4 py-2 text-[#B12704] font-semibold">₹{product.price}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.brand}</td>
                  <td className="px-4 py-2">{product.countInStock}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-3">
                      <Link to={`/admin/products/${product._id}/edit`} className="text-blue-600 hover:text-blue-800 transition-colors">
                        <Edit size={18} />
                      </Link>
                      <button onClick={() => deleteProduct(product._id)} className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
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

export default ProductList;
