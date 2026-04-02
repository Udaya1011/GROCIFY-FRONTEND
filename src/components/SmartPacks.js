import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const SmartPacks = () => {
    const { products, cartItems, setCartItems, navigate, addToCart, toggleWishlist, wishlist, user } = useAppContext();
    const [bundles, setBundles] = useState([]);
    const [smartOffers, setSmartOffers] = useState([]);

    useEffect(() => {
        const fetchBundles = async () => {
            try {
                const { data } = await axios.get('/api/bundle/list');
                if (data.success) {
                    setBundles(data.bundles);
                }
            } catch (error) {
                console.error("Error fetching bundles:", error);
            }
        };

        const fetchSmartOffers = async () => {
            if (!user) return; // Only fetch if the user is logged in
            try {
                const { data } = await axios.get('/api/offer/smart');
                if (data.success) {
                    setSmartOffers(data.offers);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Ignore 401 Unauthorized for smart offers (normal for guests)
                } else {
                    console.error("Error fetching smart offers:", error);
                }
            }
        };

        fetchBundles();
        fetchSmartOffers();
    }, [user]); // Re-run if user login state changes


    const addBundleToCart = (bundle) => {
        let addedCount = 0;
        let missingItems = [];

        // Create a local copy of the cart to update sequentially
        let newCartData = structuredClone(cartItems || {});

        bundle.items.forEach(bundleItem => {
            // Find the product in the global products list by name
            const product = products.find(p => p.name === bundleItem.productName);

            if (product) {
                // Determine current quantity in cart (or 0) using the local copy
                const currentQty = newCartData[product._id] || 0;
                // Add bundle quantity
                newCartData[product._id] = currentQty + bundleItem.quantity;
                addedCount++;
            } else {
                missingItems.push(bundleItem.productName);
            }
        });

        if (addedCount > 0) {
            setCartItems(newCartData);
            toast.success(`Added ${bundle.name} to cart!`);
        }

        if (missingItems.length > 0) {
            toast.error(`Some items were not found: ${missingItems.join(", ")}`);
        }
    };

    const handleApplyOffer = (offer) => {
        if (offer.product) {
            addToCart(offer.product._id);
            // In a real app, we'd apply a promo code or special price here.
            // For now, we simulate the 'deal' by adding the item.
            toast.success("Offer applied! Item added to cart.");
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10">
            {/* Smart Offers Section */}
            {smartOffers.length > 0 && (
                <div className="w-full mb-10 px-4 sm:px-0">
                    <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                        <span>✨</span> Just For You
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {smartOffers.map((offer) => (
                            <div key={offer.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${offer.type === 'discount' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {offer.type === 'discount' ? 'Smart Discount' : 'Combo Deal'}
                                        </span>
                                        {offer.product && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleWishlist(offer.product._id);
                                                }}
                                                className={`p-1 rounded-full transition-colors ${wishlist.includes(offer.product._id) ? "text-red-500" : "text-gray-400 hover:text-red-300"}`}
                                            >
                                                <svg className={`w-4 h-4 ${wishlist.includes(offer.product._id) ? "fill-current" : "fill-none"}`} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    {offer.discountPercentage && (
                                        <span className="text-lg font-bold text-indigo-600">{offer.discountPercentage}% OFF</span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-1">{offer.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{offer.description}</p>
                                <button
                                    onClick={() => handleApplyOffer(offer)}
                                    className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Claim Offer
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-medium">Smart Packs & Curated Bundles</h1>
            <p className="sm:w-1/3 text-center text-sm">
                Specially curated baskets for your needs. One click to get everything you need.
            </p>
            {/* Existing Bundles Grid */}
            {bundles.length === 0 ? (
                <div className="text-center text-gray-400 py-10">No curated bundles available at the moment.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-5 gap-y-6 px-4 sm:px-0 w-full">
                    {bundles.map((bundle, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="relative">
                                {/* Placeholder for bundle image handling. */}
                                <div className='w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400'>
                                    <span className="text-5xl">📦</span>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="text-xl font-semibold mb-2">{bundle.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 min-h-[40px]">{bundle.description}</p>

                                <div className="mb-4">
                                    <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Includes:</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        {bundle.items.slice(0, 4).map((item, idx) => (
                                            <li key={idx}>• {item.productName} (x{item.quantity})</li>
                                        ))}
                                        {bundle.items.length > 4 && <li>+ {bundle.items.length - 4} more items</li>}
                                    </ul>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div>
                                        <p className="text-gray-400 text-xs line-through">Estimated: ₹{bundle.price * 1.1}</p>
                                        <p className="text-lg font-bold text-gray-800">₹{bundle.price}</p>
                                    </div>
                                    <button
                                        onClick={() => addBundleToCart(bundle)}
                                        className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
                                    >
                                        Add Kit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SmartPacks;
