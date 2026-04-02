import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import adminApi, { uploadApi } from '../../services/adminApi';
import toast from 'react-hot-toast';
import { ArrowLeft, Upload, Loader } from 'lucide-react';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    discountPrice: '',
    image: '',
    brand: '',
    category: '',
    countInStock: 0,
    description: '',
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`/api/products/${id}`);
          setFormData({
            ...data,
            discountPrice: data.discountPrice || '',
          });
        } catch (err) {
          toast.error('Product not found');
          navigate('/admin/products');
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    setUploading(true);

    try {
      const { data } = await uploadApi.post('/upload', bodyFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData({ ...formData, image: data.url });
      toast.success('Image uploaded to Cloudinary');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed. Ensure Cloudinary keys are set in backend .env');
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!formData.image) return toast.error('Please upload an image or provide a URL.');

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        countInStock: Number(formData.countInStock)
      };

      if (isEditMode) {
        await adminApi.put(`/products/${id}`, payload);
        toast.success('Product updated successfully');
      } else {
        await adminApi.post('/products', payload);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  if (loading) return <div className="p-10 text-center font-semibold text-lg">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="text-gray-500 hover:text-[#0f1111] transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-[#0f1111]">{isEditMode ? 'Edit Product' : 'Create Product'}</h1>
      </div>

      <form onSubmit={submitHandler} className="amz-box p-6 shadow-sm space-y-5">
        <div>
           <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
           <input type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full px-3 py-2 border border-[#ddd] rounded-md focus:outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01"
                 className="w-full px-3 py-2 border border-[#ddd] rounded-md focus:outline-none focus:border-[#e77600]" />
           </div>
           <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Discount Price (₹)</label>
              <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} min="0" step="0.01" placeholder="Optional"
                 className="w-full px-3 py-2 border border-[#ddd] rounded-md focus:outline-none focus:border-[#e77600]" />
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} required
                 className="w-full px-3 py-2 border border-[#ddd] rounded-md focus:outline-none focus:border-[#e77600]" />
           </div>
           <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Brand</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} required
                 className="w-full px-3 py-2 border border-[#ddd] rounded-md focus:outline-none focus:border-[#e77600]" />
           </div>
        </div>

        <div>
           <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Count</label>
           <input type="number" name="countInStock" value={formData.countInStock} onChange={handleChange} required min="0"
              className="w-full px-3 py-2 border border-[#ddd] rounded-md focus:outline-none focus:border-[#e77600]" />
        </div>

        <div>
           <label className="block text-sm font-semibold text-gray-700 mb-1">Product Image (Cloudinary)</label>
           <div className="flex gap-3">
             <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="Image URL" required
                className="flex-1 px-3 py-2 border border-[#ddd] rounded-md focus:outline-none focus:border-[#e77600] bg-gray-50" />
             <label className="amz-btn-secondary px-4 py-2 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap">
                {uploading ? <Loader size={16} className="animate-spin" /> : <Upload size={16} />}
                Upload
                <input type="file" onChange={uploadFileHandler} accept="image/*" className="hidden" />
             </label>
           </div>
           {formData.image && (
             <div className="mt-3 p-2 border border-[#ddd] rounded inline-block">
                <img src={formData.image} alt="Preview" className="h-24 w-24 object-contain" />
             </div>
           )}
        </div>

        <div>
           <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
           <textarea name="description" value={formData.description} onChange={handleChange} required rows="4"
              className="w-full px-3 py-2 border border-[#ddd] rounded-md focus:outline-none focus:border-[#e77600] resize-none" />
        </div>

        <div className="pt-2">
           <button type="submit" disabled={uploading} className="amz-btn-primary w-full py-3 shadow-md font-semibold text-[15px]">
              {isEditMode ? 'Update Product' : 'Publish Product'}
           </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
