import React, { useState, useEffect } from "react";
import { assets, breakfastEssentials } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const BreakfastEssentials = () => {
    const { addToCart, removeFromCart, cartItems, navigate, wishlist, toggleWishlist } = useAppContext();
    const [filter, setFilter] = useState("All");
    const [filteredProducts, setFilteredProducts] = useState(breakfastEssentials);

    const categories = ["All", "Cereals", "Dairy", "Bakery"];

    useEffect(() => {
        if (filter === "All") {
            setFilteredProducts(breakfastEssentials);
        } else {
            setFilteredProducts(
                breakfastEssentials.filter((product) => product.subCategory === filter)
            );
        }
    }, [filter]);

    return (
        <div className="mt-20 pb-20">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
                <span>&gt;</span>
                <span className="text-gray-400">Packaged Food</span>
                <span>&gt;</span>
                <span className="text-indigo-600 font-medium">Breakfast Essentials</span>
            </div>

            {/* Header & Back Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Breakfast Essentials
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Start your morning with our fresh and healthy breakfast collection.
                    </p>
                </div>
                <button
                    onClick={() => navigate("/home")}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition w-fit shadow-md shadow-indigo-100"
                >
                    <img src={assets.white_arrow_icon} alt="" className="w-3 rotate-180" />
                    Back to Home
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                            Categories
                        </h3>
                        <div className="flex flex-wrap lg:flex-col gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat)}
                                    className={`px-4 py-2 rounded-xl text-left transition-all duration-200 ${filter === cat
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-medium"
                                        : "bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="bg-white border border-gray-100 rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
                                >
                                    <div className="relative aspect-square mb-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center p-4">
                                        <img
                                            src={product.image[0]}
                                            alt={product.name}
                                            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {/* Wishlist Icon */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleWishlist(product._id);
                                            }}
                                            className={`absolute top-2 right-2 p-2 rounded-full bg-white/90 shadow-sm border border-gray-100 transition-all z-10 ${wishlist.includes(product._id) ? "text-red-500" : "text-gray-400 hover:text-red-400"
                                                }`}
                                        >
                                            <svg
                                                className={`w-5 h-5 ${wishlist.includes(product._id) ? "fill-current" : "fill-none"}`}
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                />
                                            </svg>
                                        </button>
                                        <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm text-[10px] font-bold text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
                                            {product.subCategory}
                                        </div>
                                    </div>

                                    <h3 className="text-gray-800 font-semibold mb-1 truncate group-hover:text-indigo-600 transition-colors">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center gap-0.5 mb-3">
                                        {Array(5).fill("").map((_, i) => (
                                            <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="" className="w-3" />
                                        ))}
                                        <span className="text-[10px] text-gray-400 ml-1">(4.5)</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-indigo-600 font-bold text-lg">₹{product.offerPrice}</p>
                                            <p className="text-gray-400 text-xs line-through">₹{product.price}</p>
                                        </div>

                                        <div onClick={(e) => e.stopPropagation()}>
                                            {!cartItems?.[product?._id] ? (
                                                <button
                                                    onClick={() => addToCart(product?._id)}
                                                    className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl border border-indigo-100 font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm"
                                                >
                                                    <img src={assets.cart_icon} alt="" className="w-4 invert-0 group-hover:invert transition-all" />
                                                    Add
                                                </button>
                                            ) : (
                                                <div className="flex items-center bg-indigo-600 text-white rounded-xl shadow-md overflow-hidden animate-in fade-in zoom-in duration-200">
                                                    <button
                                                        onClick={() => removeFromCart(product?._id)}
                                                        className="px-3 py-2 hover:bg-white/20 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-6 text-center font-bold">
                                                        {cartItems[product?._id]}
                                                    </span>
                                                    <button
                                                        onClick={() => addToCart(product?._id)}
                                                        className="px-3 py-2 hover:bg-white/20 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                            <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <img src={assets.box_icon} alt="" className="w-10 opacity-20" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">No products found</h3>
                            <p className="text-gray-500 mt-2">Try selecting a different category or clearing filters.</p>
                            <button
                                onClick={() => setFilter("All")}
                                className="mt-6 text-indigo-600 font-bold hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BreakfastEssentials;
