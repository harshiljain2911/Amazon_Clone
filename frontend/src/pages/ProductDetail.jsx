import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Star, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartDB } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatPrice } from '../utils/formatters';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(data);

      if (userInfo?.token) {
        try {
          await axios.post('http://localhost:5000/api/activity/view', 
            { productId: id }, 
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
          );
        } catch (telemetryError) {
           console.warn('Telemetry sync failed silently', telemetryError);
        }
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Network Error: Connection completely disrupted.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id, userInfo]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm border border-red-200 text-red-600 px-6 py-10 rounded-2xl text-center flex flex-col items-center shadow-lg">
          <div className="w-16 h-16 bg-red-100/50 rounded-full flex items-center justify-center mb-4 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{error || "Product Not Found"}</h2>
          <p className="text-gray-600 mb-8">{error ? "We couldn't connect to our servers to load this product." : "We couldn't find the product you're looking for. It may have been removed."}</p>
          
          <div className="flex gap-4">
            {error && (
              <button 
                onClick={() => fetchProduct()}
                className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-full font-bold shadow-md active:scale-95 transition-all text-sm flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Retry Request
              </button>
            )}
            <Link to="/" className="inline-flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-500 transition-all shadow-md active:scale-95">
              <ArrowLeft size={18} /> Go Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!userInfo) {
      toast.error('Sign in to add items to your cart');
      return navigate('/login');
    }
    dispatch(addToCartDB({ item: product, qty }));
    toast.success(`${product.name.split(' ').slice(0,3).join(' ')} added to remote cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-black hover:underline">
        <ArrowLeft size={20} /> Back to results
      </Link>
      
      <div className="flex flex-col md:flex-row gap-10 bg-white p-6 rounded shadow-md">
        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center sticky top-28 h-fit">
          <img src={product.image} alt={product.name} className="max-w-full h-[400px] object-contain" />
        </div>

        {/* Details Section */}
        <div className="md:w-1/4 flex flex-col pt-4 flex-grow border-b md:border-b-0 md:border-r border-gray-200 pr-6">
          <h1 className="text-3xl font-bold font-serif mb-2 text-gray-900 leading-tight tracking-tight">{product.name}</h1>
          <a href="#" className="text-blue-500 hover:underline mb-2">Visit the {product.brand} Store</a>

          <div className="flex items-center gap-2 mb-4 border-b pb-4">
             <div className="flex text-yellow-500 font-bold">
               {product.rating} <Star className="inline w-4 h-4 ml-1 fill-current" />
             </div>
             <span className="text-blue-500 hover:underline cursor-pointer">{product.numReviews} ratings</span>
          </div>

          <div className="text-gray-500 mb-2">Price: <span className="text-3xl font-medium text-black">{formatPrice(product.price)}</span></div>
          
          <div className="mt-4 border-t pt-4">
             <h3 className="font-bold mb-2">About this item:</h3>
             <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
          </div>
        </div>

        {/* Action Section */}
        <div className="md:w-1/4 pt-4 md:pl-6">
           <div className="border rounded-lg p-5 flex flex-col h-full bg-gray-50">
             <span className="text-2xl font-semibold mb-4 block">{formatPrice(product.price)}</span>
             
             <div className="text-green-600 font-bold text-lg mb-4">
               {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
             </div>
             
             {product.countInStock > 0 && (
               <div className="flex items-center gap-2 mb-6">
                 <label htmlFor="qty" className="font-medium">Qty:</label>
                 <select 
                   id="qty" 
                   value={qty} 
                   onChange={(e) => setQty(Number(e.target.value))} 
                   className="border p-2 rounded w-20 shadow-sm"
                 >
                   {[...Array(product.countInStock).keys()].map(x => (
                     <option key={x+1} value={x+1}>{x+1}</option>
                   ))}
                 </select>
               </div>
             )}
             
             <button 
               onClick={handleAddToCart}
               className="bg-yellow-400 hover:bg-yellow-500 w-full py-3 rounded-full font-semibold shadow-md mb-3 flex justify-center items-center gap-2 active:scale-95 transition-transform" 
               disabled={product.countInStock === 0}
             >
               <ShoppingCart size={18} /> Add to Cart
             </button>
             <button className="bg-orange-400 hover:bg-orange-500 w-full py-3 rounded-full font-semibold shadow-md active:scale-95 transition-transform" disabled={product.countInStock === 0}>
               Buy Now
             </button>

             <div className="mt-4 text-xs text-gray-500 flex flex-col gap-2">
                <span className="flex items-center gap-1"><ShieldCheck size={16} /> Secure transaction</span>
                Ships from Amazon
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
