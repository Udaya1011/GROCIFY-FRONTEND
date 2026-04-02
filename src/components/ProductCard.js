import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { addToCart, removeFromCart, cartItems, navigate, wishlist, toggleWishlist } = useAppContext();
  const [selectedWeight, setSelectedWeight] = useState("1kg");

  const weightBasedCategories = ["Vegetables", "Fruits", "Rice", "Dal"];
  const isWeightBased = weightBasedCategories.includes(product.category);

  // Parse default weight from product name if available
  useEffect(() => {
    if (isWeightBased) {
      const match = product.name.match(/(\d+)\s*(g|kg)/i);
      if (match) {
        setSelectedWeight(`${match[1]}${match[2].toLowerCase()}`);
      }
    }
  }, [product, isWeightBased]);

  const weightOptions = ["250g", "500g", "1kg", "2kg", "5kg"];

  const getPrice = () => {
    if (!isWeightBased) return { price: product.price, offerPrice: product.offerPrice };

    const baseWeightMatch = product.name.match(/(\d+)\s*(g|kg)/i);
    if (!baseWeightMatch) return { price: product.price, offerPrice: product.offerPrice };

    const baseVal = parseFloat(baseWeightMatch[1]);
    const baseUnit = baseWeightMatch[2].toLowerCase();
    const baseInGrams = baseUnit === 'kg' ? baseVal * 1000 : baseVal;

    const selectedWeightMatch = selectedWeight.match(/(\d+)\s*(g|kg)/i);
    if (!selectedWeightMatch) return { price: product.price, offerPrice: product.offerPrice };

    const selectedVal = parseFloat(selectedWeightMatch[1]);
    const selectedUnit = selectedWeightMatch[2].toLowerCase();
    const selectedInGrams = selectedUnit === 'kg' ? selectedVal * 1000 : selectedVal;

    const scaleFactor = selectedInGrams / baseInGrams;
    return {
      price: Math.round(product.price * scaleFactor),
      offerPrice: Math.round(product.offerPrice * scaleFactor)
    };
  };

  const { price, offerPrice } = getPrice();
  const cartKey = isWeightBased ? `${product._id}_${selectedWeight}` : product._id;
  return (
    product && (
      <div
        onClick={() => {
          navigate(
            `/product/${product.category.toLowerCase()}/${product?._id}`
          );
          scrollTo(0, 0);
        }}
        className="relative border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full group overflow-hidden"
      >
        {/* Wishlist Heart Icon */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/95 shadow-sm border border-gray-100 cursor-pointer hover:scale-110 transition-all active:scale-95"
        >
          <svg
            className={`w-5 h-5 ${wishlist.includes(product._id) ? "fill-red-500 stroke-red-500" : "fill-none stroke-gray-400"}`}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <div className="group cursor-pointer flex items-center justify-center px-2 h-32 md:h-40">
          <img
            className="group-hover:scale-105 transition max-h-full max-w-full object-contain"
            src={
              product.image[0].startsWith('http') ||
                product.image[0].startsWith('data:') ||
                product.image[0].startsWith('/')
                ? product.image[0]
                : `${import.meta.env.VITE_BACKEND_URL || (window.location.hostname.includes('onrender.com') ? 'https://grocify-backend-1.onrender.com' : 'http://localhost:5000')}/images/${product.image[0]}`
            }
            alt={product.name}
          />
        </div>
        <div className="text-gray-500/60 text-sm">
          <p>{product.category}</p>
          <p className="text-gray-700 font-medium text-lg truncate w-full">
            {product.name}
          </p>
          <div className="flex items-center gap-0.5">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="rating"
                  className="w-3 md:w-3.5"
                />
              ))}
            <p>(4)</p>
          </div>

          {isWeightBased && (
            <div className="flex flex-wrap gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
              {weightOptions.map((weight) => (
                <button
                  key={weight}
                  onClick={() => setSelectedWeight(weight)}
                  className={`px-1.5 py-0.5 text-[10px] rounded border transition-all ${selectedWeight === weight
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300"
                    }`}
                >
                  {weight}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-end justify-between mt-3">
            <p className="md:text-xl text-base font-medium text-indigo-500">
              ₹{offerPrice}{" "}
              <span className="text-gray-500/60 md:text-sm text-xs line-through">
                ₹{price}
              </span>
            </p>
            <div
              onClick={(e) => e.stopPropagation()}
              className="text-indigo-500"
            >
              {!cartItems?.[cartKey] ? (
                <button
                  onClick={() => addToCart(product?._id, isWeightBased ? selectedWeight : null)}
                  className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 md:w-[80px] w-[64px] h-[34px] rounded text-indigo-600 font-medium cursor-pointer"
                >
                  <img src={assets.cart_icon} alt="cart icon" />
                  Add
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-indigo-500/25 rounded select-none">
                  <button
                    onClick={() => removeFromCart(cartKey)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    -
                  </button>
                  <span className="w-5 text-center">
                    {cartItems[cartKey]}
                  </span>
                  <button
                    onClick={() => addToCart(product?._id, isWeightBased ? selectedWeight : null)}
                    className="cursor-pointer text-md px-2 h-full"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};
export default ProductCard;
