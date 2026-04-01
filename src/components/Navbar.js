import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets, categories } from "../assets/assets";
import toast from "react-hot-toast";
import VoiceSearch from "./VoiceSearch";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const {
    user,
    setUser,
    showUserLogin,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    cartCount,
    isAdmin,
    setIsAdmin,
    isSeller,
    setIsSeller,
    axios,
    logout,
  } = useAppContext();

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate("/products");
    }
  }, [searchQuery]);

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all z-50">
      <Link to="/home" className="flex items-center gap-2">
        <img src={assets.cart_icon} alt="" className="w-9" />
        <h2 className="text-2xl font-bold text-primary">Grocify</h2>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">

        {/* Shop by Category Mega Menu */}
        <div
          className="relative group"
          onMouseEnter={() => setShowCategoryMenu(true)}
          onMouseLeave={() => setShowCategoryMenu(false)}
        >
          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md font-medium transition-colors hover:bg-green-700">
            Shop by Category
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-4 h-4 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute top-full left-0 w-64 bg-white shadow-xl border border-gray-100 rounded-md overflow-hidden transition-all duration-300 ease-in-out origin-top ${showCategoryMenu ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible'}`}
          >
            <ul className="py-2">
              {categories.map((cat, index) => (
                <li key={index}>
                  <div
                    onClick={() => {
                      const specialPaths = ['breakfast-essentials', 'noodles-pasta', 'ketchup-dips-spreads', 'chocolate-sweets', 'jams-honey', 'pickles-chutney', 'ready-to-cook', 'baking-essentials', 'masalas-spices', 'household-care', 'detergent', 'snacks'];
                      if (specialPaths.includes(cat.path.toLowerCase())) {
                        navigate(`/${cat.path.toLowerCase()}`);
                      } else {
                        navigate(`/products/${cat.path.toLowerCase()}`);
                      }
                      setShowCategoryMenu(false);
                      window.scrollTo(0, 0);
                    }}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between group/item transition-colors"
                  >
                    <span className="text-gray-700 font-medium group-hover/item:text-primary">{cat.text}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 group-hover/item:text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Link to={"/home"} className="hover:text-primary transition-colors">Home</Link>
        <Link to={"/products"} className="hover:text-primary transition-colors">All Products</Link>
        <Link to={"/recipes"} className="hover:text-primary transition-colors">Recipes</Link>

        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.836 10.615 15 14.695"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              clipRule="evenodd"
              d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783"
              stroke="#7A7B7D"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <VoiceSearch />
        </div>

        <div
          onClick={() => navigate("/cart")}
          className="relative cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#615fff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
            {cartCount()}
          </button>
        </div>

        {!user && (<div className="group relative">
          <button
            onClick={() => {
              setOpen(false);
              navigate('/login');
            }}
            className={`cursor-pointer px-8 py-2 bg-white text-indigo-500 font-medium border border-indigo-200 hover:bg-indigo-50 transition rounded-full flex items-center gap-1`}
          >
            Login
          </button>
          {isAdmin && (
            <div className="absolute top-full left-0 pt-2 w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
              <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                <ul className="py-1">
                  <li
                    onClick={() => navigate("/admin")}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-indigo-600 font-medium flex items-center gap-2"
                  >
                    <span>Admin Panel</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 pt-2 w-72 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
            <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <p className="text-sm text-gray-600">New customer?</p>
                <button
                  onClick={() => {
                    navigate('/register');
                  }}
                  className="text-indigo-600 font-semibold text-sm hover:underline"
                >
                  Sign Up
                </button>
              </div>

              {/* Menu Items */}
              <ul className="py-2">
                <li className="hover:bg-gray-50 px-4 py-3 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors" onClick={() => navigate('/login')}>
                  <img src={assets.profile_icon} alt="" className="w-5 h-5 opacity-70" />
                  <span className="text-sm font-medium">My Profile</span>
                </li>
                <li className="hover:bg-gray-50 px-4 py-3 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors" onClick={() => navigate('/my-orders')}>
                  <img src={assets.order_icon} alt="" className="w-5 h-5 opacity-70" />
                  <span className="text-sm font-medium">Orders</span>
                </li>
                <li className="hover:bg-gray-50 px-4 py-3 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors" onClick={() => navigate('/my-account?tab=wishlist')}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  <span className="text-sm font-medium">Wishlist</span>
                </li>
                <li className="hover:bg-gray-50 px-4 py-3 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors" onClick={() => navigate('/login')}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v5.25m18 0h-2.25a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 002.25 2.25H21m-18 0h2.25a2.25 2.25 0 002.25-2.25v-1.5a2.25 2.25 0 00-2.25-2.25H3" />
                  </svg>
                  <span className="text-sm font-medium">Rewards</span>
                </li>
                <li className="hover:bg-gray-50 px-4 py-3 cursor-pointer flex items-center gap-3 text-gray-700 transition-colors" onClick={() => navigate('/login')}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                  </svg>
                  <span className="text-sm font-medium">Gift Cards</span>
                </li>
                <li className="hover:bg-gray-50 px-4 py-3 cursor-pointer flex items-center gap-3 text-indigo-600 transition-colors border-t border-indigo-50 mt-2" onClick={() => navigate('/admin-login')}>
                  <svg className="h-5 w-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-bold">Admin Login</span>
                </li>
              </ul>
            </div>
          </div>
        </div>)}
        {user ? (
          <div className="group relative">
            <button className={`cursor-pointer px-4 py-2 text-indigo-500 font-medium hover:bg-indigo-50 transition rounded-full flex items-center gap-1`}>
              {user.name}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <ul className="hidden group-hover:block absolute top-full right-0 bg-white shadow-xl border border-gray-100 py-2 w-48 rounded-md z-40 text-sm">

              <li
                onClick={() => navigate("/my-account")}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700"
              >
                <img src={assets.profile_icon} alt="" className="w-4 h-4 opacity-70" />
                <span>My Account</span>
              </li>

              <li
                onClick={() => navigate("/my-account?tab=orders")}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700"
              >
                <img src={assets.order_icon} alt="" className="w-4 h-4 opacity-70" />
                <span>Orders</span>
              </li>

              <li
                onClick={() => navigate("/my-account?tab=wishlist")}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 opacity-70">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <span>Wishlist</span>
              </li>

              {isAdmin && (
                <li
                  onClick={() => {
                    navigate("/admin");
                  }}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-indigo-600 font-medium bg-indigo-50"
                >
                  <span>Admin Panel</span>
                </li>
              )}

              <li
                onClick={logout}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-gray-700 border-t border-gray-100 mt-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 opacity-70">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                <span>Logout</span>
              </li>
            </ul>
          </div>
        ) : null}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-6 sm:hidden">
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
              stroke="#615fff"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">
            {cartCount()}
          </button>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          className=""
        >
          {/* Menu Icon SVG */}
          <svg
            width="21"
            height="15"
            viewBox="0 0 21 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="21" height="1.5" rx=".75" fill="#426287" />
            <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
            <rect
              x="6"
              y="13"
              width="15"
              height="1.5"
              rx=".75"
              fill="#426287"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${open ? "flex" : "hidden"
          } absolute top-full left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm sm:hidden z-40 transition-all`}
      >
        <Link onClick={() => setOpen(false)} to={"/home"} className="py-2 w-full border-b border-gray-100">
          Home
        </Link>
        <Link onClick={() => setOpen(false)} to={"/products"} className="py-2 w-full border-b border-gray-100">
          Products
        </Link>
        <Link onClick={() => setOpen(false)} to={"/recipes"} className="py-2 w-full border-b border-gray-100">
          Recipes
        </Link>

        {/* Mobile Dropdown for Categories */}
        <div className="w-full">
          <button
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className="py-2 w-full text-left font-medium flex justify-between items-center border-b border-gray-100"
          >
            Shop by Category
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className={`w-4 h-4 transition-transform ${showCategoryMenu ? 'rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          {showCategoryMenu && (
            <div className="pl-4 py-2 bg-gray-50 rounded-md">
              {categories.map((cat, index) => (
                <div
                  key={index}
                  onClick={() => {
                    const specialPaths = ['breakfast-essentials', 'noodles-pasta', 'ketchup-dips-spreads', 'chocolate-sweets', 'jams-honey', 'pickles-chutney', 'ready-to-cook', 'baking-essentials', 'masalas-spices', 'household-care', 'detergent', 'snacks'];
                    if (specialPaths.includes(cat.path.toLowerCase())) {
                      navigate(`/${cat.path.toLowerCase()}`);
                    } else {
                      navigate(`/products/${cat.path.toLowerCase()}`);
                    }
                    setOpen(false);
                  }}
                  className="py-2 text-gray-600"
                >
                  {cat.text}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => {
            setOpen(false);
            navigate('/login');
          }}
          className={`${user ? "hidden" : "block"} mt-4 cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full w-full`}
        >
          Login
        </button>
        {user ? (
          <div className="mt-4 w-full">
            <div className="flex items-center gap-2 mb-4">
              <img src={assets.profile_icon} alt="" className="w-10" />
              <p className="font-medium">User</p>
            </div>
            <ul className="flex flex-col gap-2">
              <li
                onClick={() => {
                  navigate("/my-orders");
                  setOpen(false);
                }}
                className="p-2 cursor-pointer bg-gray-50 rounded"
              >
                My Orders
              </li>
              <li
                onClick={() => {
                  setIsAdmin(false);
                  navigate("/admin");
                  setOpen(false);
                }}
                className="p-2 cursor-pointer text-indigo-500 font-medium bg-gray-50 rounded"
              >
                Admin Panel
              </li>
              <li
                className="cursor-pointer p-2 bg-red-50 text-red-500 rounded"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                Logout
              </li>
            </ul>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
