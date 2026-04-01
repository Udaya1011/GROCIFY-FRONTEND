import React from "react";
import { assets, detergentProducts } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";

const Detergent = () => {
    const { addToCart, removeFromCart, cartItems, navigate, wishlist, toggleWishlist } = useAppContext();

    return (
        <div className="mt-20 pb-20">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
                <span>&gt;</span>
                <span className="text-indigo-600 font-medium">Detergent</span>
            </div>

            {/* Header & Back Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        Detergent
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Keep your clothes fresh and clean with our range of detergents, soaps, and fabric care products.
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

            {/* Product Grid - Fixed 5 products without categories */}
            <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:grid-cols-5 gap-6">
                    {detergentProducts.map((product) => (
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
            </div>
        </div>
    );
};

export default Detergent;
