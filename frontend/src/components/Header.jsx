import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Search, Menu, MapPin, ChevronDown, LogOut, Heart, Package } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartTotals, clearCart } from '../slices/cartSlice';
import { clearWishlist } from '../slices/wishlistSlice';
import { toggleCartDrawer, setSearchQuery } from '../slices/uiSlice';
import { logout } from '../slices/userSlice';
import { formatPrice } from '../utils/formatters';

const CATEGORIES = [
  'All', 'Electronics', 'Mobiles', 'Computers', 'Books',
  'Fashion', 'Home & Kitchen', 'Toys', 'Sports', 'Grocery',
];

const Header = () => {
  const dispatch    = useDispatch();
  const navigate    = useNavigate();
  const location    = useLocation();
  const dropdownRef = useRef(null);

  const { itemsCount }  = useSelector(selectCartTotals);
  const { userInfo }    = useSelector((state) => state.user);
  const [localSearch, setLocalSearch]         = useState('');
  const [deliverLocation, setDeliverLocation] = useState('India');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions]         = useState([]);
  const [selectedCat, setSelectedCat]         = useState('All');
  const [showAccountDrop, setShowAccountDrop] = useState(false);
  const dropTimer = useRef(null);

  /* ── Geolocation ─────────────────────────── */
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res  = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
          );
          const data = await res.json();
          setDeliverLocation(data.city || data.locality || data.principalSubdivision || 'India');
        } catch { setDeliverLocation('India'); }
      },
      () => setDeliverLocation('India')
    );
  }, []);

  /* ── Search debounce + suggestions ──────── */
  useEffect(() => {
    const handler = setTimeout(async () => {
      dispatch(setSearchQuery(localSearch));
      if (localSearch.trim().length >= 2) {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/products?search=${localSearch}`);
          setSuggestions(data.slice(0, 6));
          setShowSuggestions(true);
        } catch { setSuggestions([]); }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [localSearch, dispatch]);

  /* ── Handlers ───────────────────────────── */
  const handleCartClick = (e) => {
    e.preventDefault();
    if (location.pathname !== '/cart') dispatch(toggleCartDrawer());
    else navigate('/cart');
  };

  const logoutHandler = () => {
    setShowAccountDrop(false);
    dispatch(logout());
    dispatch(clearCart());
    dispatch(clearWishlist());
    navigate('/login');
  };

  const handleSearch = () => {
    if (localSearch.trim()) {
      dispatch(setSearchQuery(localSearch));
      setShowSuggestions(false);
    }
  };

  const openDrop  = () => { clearTimeout(dropTimer.current); setShowAccountDrop(true); };
  const closeDrop = () => { dropTimer.current = setTimeout(() => setShowAccountDrop(false), 200); };

  /* ── Greeting ───────────────────────────── */
  const greeting = userInfo ? `Hello, ${(userInfo.name || userInfo.email).split(' ')[0]}` : 'Hello, sign in';

  return (
    <header className="sticky top-0 z-50" style={{ boxShadow: '0 2px 4px -1px rgba(0,0,0,0.3)' }}>

      {/* ════════════ MAIN NAV ════════════ */}
      <div className="bg-[#131921] text-white">
        <div className="flex items-center gap-2 px-3 py-2 max-w-[1500px] mx-auto">

          {/* ── Logo ─────────────────────────── */}
          <Link
            to="/"
            className="amz-nav-item flex-shrink-0 flex flex-col items-center py-2 px-1 mt-1"
            aria-label="Amazon Home"
          >
            <span className="text-white font-bold text-xl leading-none tracking-tighter"
                  style={{ fontFamily: 'Georgia, serif' }}>
              amazon
            </span>
            <span className="text-[#febd69] text-[10px] leading-none self-end -mt-0.5">.in</span>
          </Link>

          {/* ── Deliver to ───────────────────── */}
          <div className="amz-nav-item hidden lg:flex flex-col justify-end py-2 px-2 flex-shrink-0">
            <span className="text-[#cccccc] text-[11px] leading-none">Deliver to</span>
            <span className="text-white font-bold text-xs flex items-center gap-1 mt-0.5">
              <MapPin size={14} className="text-white flex-shrink-0" />
              {deliverLocation}
            </span>
          </div>

          {/* ── Search bar ───────────────────── */}
          <div className="flex-1 flex items-stretch relative min-w-0 h-[40px] rounded-md overflow-hidden">
            {/* Category dropdown */}
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="bg-[#f3f3f3] text-[#0f1111] text-xs px-2 border-r border-[#cdba69]
                         outline-none cursor-pointer hidden sm:block flex-shrink-0 h-full
                         hover:bg-[#e3e3e3] transition-colors"
              style={{ minWidth: '64px' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {/* Input */}
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 h-full text-[#0f1111] text-sm px-3 outline-none bg-white min-w-0"
              placeholder="Search Amazon.in"
              aria-label="Search"
            />

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="flex-shrink-0 bg-[#febd69] hover:bg-[#f3a847] h-full w-[46px]
                         flex items-center justify-center text-[#0f1111] transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-[#ddd]
                              shadow-xl z-50 rounded-b-sm">
                {suggestions.map((p) => (
                  <button
                    key={p._id}
                    onMouseDown={() => {
                      setLocalSearch(p.name);
                      dispatch(setSearchQuery(p.name));
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#f3f3f3]
                               text-left border-b border-[#f0f0f0] last:border-0"
                  >
                    <Search size={13} className="text-[#565959] flex-shrink-0" />
                    <span className="text-sm text-[#0f1111] line-clamp-1">{p.name}</span>
                    <span className="ml-auto text-xs text-[#565959]">{formatPrice(p.price)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Right side ─────────────────── */}
          <div className="flex items-stretch gap-0.5 flex-shrink-0 ml-1">

            {/* Account & Lists */}
            <div
              className="amz-nav-item relative flex flex-col justify-center py-1 px-2 cursor-pointer"
              onMouseEnter={openDrop}
              onMouseLeave={closeDrop}
              ref={dropdownRef}
            >
              {userInfo ? (
                <>
                  <span className="text-[#cccccc] text-[11px] leading-none">Hello, {(userInfo.name || userInfo.email).split(' ')[0]}</span>
                  <span className="text-white font-bold text-xs flex items-center gap-0.5 mt-0.5 whitespace-nowrap">
                    Account &amp; Lists <ChevronDown size={12} className="mt-0.5" />
                  </span>
                </>
              ) : (
                <Link to="/login" className="flex flex-col hover:no-underline">
                  <span className="text-[#cccccc] text-[11px] leading-none">Hello, sign in</span>
                  <span className="text-white font-bold text-xs flex items-center gap-0.5 mt-0.5 whitespace-nowrap">
                    Account &amp; Lists <ChevronDown size={12} className="mt-0.5" />
                  </span>
                </Link>
              )}

              {/* Dropdown */}
              {showAccountDrop && userInfo && (
                <div
                  className="absolute top-full right-0 bg-white border border-[#ddd] shadow-xl
                             z-50 w-48 rounded-sm text-[#0f1111] py-2"
                  onMouseEnter={openDrop}
                  onMouseLeave={closeDrop}
                >
                  <div className="px-4 py-2 border-b border-[#ddd]">
                    <p className="text-xs text-[#565959]">Signed in as</p>
                    <p className="text-sm font-semibold truncate">{userInfo.name || userInfo.email}</p>
                  </div>
                  <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#f3f3f3] hover:no-underline text-[#0f1111]">
                    <Package size={15} className="text-[#565959]" /> Your Orders
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#f3f3f3] hover:no-underline text-[#0f1111]">
                    <Heart size={15} className="text-[#565959]" /> Wish List
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#f3f3f3] w-full text-left text-[#0f1111]"
                  >
                    <LogOut size={15} className="text-[#565959]" /> Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Returns & Orders */}
            <Link
              to="/orders"
              className="amz-nav-item hidden md:flex flex-col justify-center py-1 px-2 hover:no-underline"
            >
              <span className="text-[#cccccc] text-[11px] leading-none">Returns</span>
              <span className="text-white font-bold text-xs mt-0.5 whitespace-nowrap">&amp; Orders</span>
            </Link>

            {/* Cart */}
            <button
              onClick={handleCartClick}
              className="amz-nav-item flex items-end gap-1 py-1 px-2 relative"
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingCart size={30} className="text-white" />
                <span
                  className="absolute -top-1 left-1/2 -translate-x-1/2 min-w-[18px] h-[18px]
                             bg-[#febd69] text-[#0f1111] text-xs font-bold rounded-full
                             flex items-center justify-center px-1 leading-none"
                >
                  {itemsCount}
                </span>
              </div>
              <span className="text-white font-bold text-xs mb-0.5 hidden sm:block">Cart</span>
            </button>
          </div>
        </div>
      </div>

      {/* ════════════ SECONDARY NAV ════════════ */}
      <div className="bg-[#232f3e] text-white text-sm overflow-x-auto hide-scrollbar">
        <div className="flex items-center gap-0 px-3 py-1.5 max-w-[1500px] mx-auto whitespace-nowrap">
          <button className="amz-nav-item flex items-center gap-1.5 font-bold text-sm px-3 py-1.5 flex-shrink-0">
            <Menu size={18} /> All
          </button>
          {[
            "Today's Deals", "Customer Service", "Registry",
            "Gift Cards", "Sell", "Prime", "Electronics", "Fashion", "Home & Kitchen"
          ].map((item) => (
            <span key={item} className="amz-nav-item px-3 py-1.5 text-sm cursor-pointer flex-shrink-0">
              {item}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
