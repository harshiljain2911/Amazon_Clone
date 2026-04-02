import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import RecommendationRow from '../components/RecommendationRow';
import CategoryRow from '../components/CategoryRow';
import { getRecommendations } from '../services/aiRecommendations';

const CATEGORIES = [
  { key: 'all',         label: 'All',           icon: '🏠' },
  { key: 'Electronics', label: 'Electronics',   icon: '⚡' },
  { key: 'Fashion',     label: 'Fashion',       icon: '👗' },
  { key: 'Groceries',   label: 'Groceries',     icon: '🛒' },
  { key: 'Home',        label: 'Home & Kitchen', icon: '🏡' },
  { key: 'Books',       label: 'Books',         icon: '📚' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const [mlData,    setMlData]    = useState({ recommendedForYou: [], becauseYouViewed: [] });
  const [mlLoading, setMlLoading] = useState(true);

  const { searchQuery } = useSelector((s) => s.ui);
  const { userInfo }    = useSelector((s) => s.user);

  /* ── Fetch ── */
  const fetchDependencies = async () => {
    try {
      setLoading(true);
      setMlLoading(true);
      setError(null);

      const [productsRes, mlRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/products${searchQuery ? `?search=${searchQuery}` : ''}`),
        !searchQuery
          ? getRecommendations(userInfo?.token)
          : Promise.resolve({ recommendedForYou: [], becauseYouViewed: [] }),
      ]);

      setProducts(productsRes.data);
      if (!searchQuery) setMlData(mlRes);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reach the server. Please check your connection.');
    } finally {
      setLoading(false);
      setMlLoading(false);
    }
  };

  useEffect(() => { fetchDependencies(); }, [searchQuery, userInfo]);

  /* ── Derived ── */
  const filtered =
    activeTab === 'all'
      ? products
      : products.filter((p) => p.category?.toLowerCase() === activeTab.toLowerCase());

  const byCategory = (key) =>
    products.filter((p) => p.category?.toLowerCase() === key.toLowerCase());

  /* ── Error state ── */
  if (error) return (
    <div className="bg-[#f3f3f3] min-h-screen flex items-center justify-center p-6">
      <div className="bg-white border border-[#ddd] rounded-sm p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-bold text-[#0f1111] mb-2">Something went wrong</h3>
        <p className="text-sm text-[#565959] mb-5">{error}</p>
        <button
          onClick={fetchDependencies}
          className="amz-btn-primary px-8 py-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f3f3f3] min-h-screen">

      {/* ── Hero carousel (only when not searching) ── */}
      {!searchQuery && <HeroCarousel />}

      {/* ── Main content container ── */}
      <div className="max-w-[1500px] mx-auto px-3 sm:px-4 pb-10">

        {/* ── Search results heading ── */}
        {searchQuery && (
          <div className="bg-white border border-[#ddd] rounded-sm p-4 mb-4 mt-3">
            <h2 className="text-lg font-bold text-[#0f1111]">
              Results for{' '}
              <span className="text-[#c7511f]">"{searchQuery}"</span>
            </h2>
            <p className="text-sm text-[#565959] mt-0.5">
              {products.length} result{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* ── Category filter pills (no search active) ── */}
        {!searchQuery && (
          <div className="bg-white border border-[#ddd] rounded-sm px-4 py-3 mb-4">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setActiveTab(cat.key)}
                  className={`flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                              font-medium transition-all whitespace-nowrap border
                              ${activeTab === cat.key
                                ? 'bg-[#0f1111] text-white border-[#0f1111]'
                                : 'bg-white text-[#0f1111] border-[#ddd] hover:border-[#999] hover:shadow-sm'
                              }`}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Empty search results ── */}
        {searchQuery && products.length === 0 && !loading && (
          <div className="bg-white border border-[#ddd] rounded-sm py-16 text-center">
            <Search size={48} className="text-[#565959] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#0f1111]">No results found</h3>
            <p className="text-sm text-[#565959] mt-2">
              Try different keywords or check your spelling.
            </p>
          </div>
        )}

        {/* ── Section heading ── */}
        {!searchQuery && (
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-lg font-bold text-[#0f1111] tracking-tight">
              {activeTab === 'all'
                ? 'Recommended for You'
                : CATEGORIES.find((c) => c.key === activeTab)?.label}
            </h2>
            <a href="#" className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline">
              See more deals
            </a>
          </div>
        )}

        {/* ── Product Grid — search OR category tab view ── */}
        <div className="bg-white border border-[#ddd] rounded-sm p-4 mb-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {loading
              ? Array(12).fill(null).map((_, i) => <SkeletonLoader key={i} />)
              : filtered.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
            }
          </div>
        </div>

        {/* ── Category Rows (All tab, no search) ── */}
        {!searchQuery && !loading && products.length > 0 && activeTab === 'all' && (
          <>
            <CategoryRow title="Electronics"    icon="⚡" products={byCategory('Electronics')} categoryKey="Electronics" />
            <CategoryRow title="Fashion"        icon="👗" products={byCategory('Fashion')}     categoryKey="Fashion" />
            <CategoryRow title="Home & Kitchen" icon="🏡" products={byCategory('Home')}        categoryKey="Home" />
            <CategoryRow title="Books"          icon="📚" products={byCategory('Books')}       categoryKey="Books" />
          </>
        )}

        {/* ── AI Recommendations ── */}
        {!searchQuery && (
          <>
            <RecommendationRow
              title="Because You Viewed Similar Items"
              products={mlData.becauseYouViewed}
              loading={mlLoading}
            />
            <div className="h-4" />
            <RecommendationRow
              title="Recommended for You"
              products={mlData.recommendedForYou}
              loading={mlLoading}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
