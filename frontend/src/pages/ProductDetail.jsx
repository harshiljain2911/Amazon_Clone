import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Star, ShieldCheck, ArrowLeft } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center py-20 text-2xl font-bold">Loading...</div>;

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

          <div className="text-gray-500 mb-2">Price: <span className="text-3xl font-medium text-black">${product.price}</span></div>
          
          <div className="mt-4 border-t pt-4">
             <h3 className="font-bold mb-2">About this item:</h3>
             <p className="text-gray-700 leading-relaxed text-sm">{product.description}</p>
          </div>
        </div>

        {/* Action Section */}
        <div className="md:w-1/4 pt-4 md:pl-6">
           <div className="border rounded-lg p-5 flex flex-col h-full bg-gray-50">
             <span className="text-2xl font-semibold mb-4 block">${product.price}</span>
             
             <div className="text-green-600 font-bold text-lg mb-4">
               {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
             </div>
             
             {product.countInStock > 0 && (
               <div className="flex items-center gap-2 mb-6">
                 <label htmlFor="qty" className="font-medium">Qty:</label>
                 <select id="qty" className="border p-2 rounded w-20 shadow-sm">
                   {[...Array(product.countInStock).keys()].map(x => (
                     <option key={x+1} value={x+1}>{x+1}</option>
                   ))}
                 </select>
               </div>
             )}
             
             <button className="bg-yellow-400 hover:bg-yellow-500 w-full py-3 rounded-full font-semibold shadow-md mb-3 flex justify-center items-center gap-2 active:scale-95 transition-transform" disabled={product.countInStock === 0}>
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
