import { useAppContext } from "../../context/AppContext";
import ProductCard from "../ProductCard";

const Wishlist = () => {
    const { wishlist, products, allStaticProducts, addToCart, toggleWishlist } = useAppContext();

    const combinedProducts = [];
    const seenIds = new Set();

    [...products, ...(allStaticProducts || [])].forEach(p => {
        if (p && p._id && !seenIds.has(p._id)) {
            combinedProducts.push(p);
            seenIds.add(p._id);
        }
    });

    const wishlistedProducts = combinedProducts.filter(p => wishlist.includes(p._id));

    if (wishlistedProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-800">Your wishlist is empty</h3>
                <p className="text-gray-500 mt-2">Save items that you like to your wishlist to review them later.</p>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist ({wishlistedProducts.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistedProducts.map((product) => (
                    <div key={product._id} className="relative group">
                        <ProductCard product={product} />
                        <div className="mt-2 flex gap-2">
                            <button
                                onClick={() => {
                                    addToCart(product._id);
                                    toggleWishlist(product._id);
                                }}
                                className="flex-1 bg-indigo-50 border border-indigo-100 text-indigo-600 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
                            >
                                Move to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
