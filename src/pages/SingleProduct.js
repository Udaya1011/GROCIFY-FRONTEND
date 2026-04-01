import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets, dummyProducts, noodlesPastaProducts, ketchupDipsSpreadsProducts, chocolateSweetsProducts, masalasSpicesProducts, breakfastEssentials, bakingEssentialsProducts } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import toast from "react-hot-toast";
const SingleProduct = () => {
  const { products, navigate, addToCart, toggleWishlist, wishlist, allStaticProducts } = useAppContext();
  const { id } = useParams();
  const [thumbnail, setThumbnail] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState("1kg");

  const weightBasedCategories = ["Vegetables", "Fruits", "Rice", "Dal"];

  const product = products.find((p) => p._id === id) || (allStaticProducts || []).find((p) => p._id === id);
  console.log("product", product);
  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (product) => product.category === product.category
      );
      setRelatedProducts(productsCopy.slice(0, 5));
    }
  }, [products]);

  useEffect(() => {
    setThumbnail(product?.image[0] ? product.image[0] : null);
    if (product && weightBasedCategories.includes(product.category)) {
      const match = product.name.match(/(\d+)\s*(g|kg)/i);
      if (match) {
        setSelectedWeight(`${match[1]}${match[2].toLowerCase()}`);
      }
    }
  }, [product]);

  const isWeightBased = product && weightBasedCategories.includes(product.category);
  const weightOptions = ["250g", "500g", "1kg", "2kg", "5kg"];

  const getPrice = () => {
    if (!isWeightBased) return { price: product?.price, offerPrice: product?.offerPrice };

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
  // Reminder State
  const [showReminderOptions, setShowReminderOptions] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState("Daily");
  const [axios] = useState(useAppContext().axios); // Safe access if not exported directly, but usually axios is attached to context.
  // Actually useAppContext returns axios.

  const handleSetReminder = async () => {
    try {
      const { data } = await axios.post("/api/reminder/create", {
        productId: product._id,
        frequency: reminderFrequency
      });
      if (data.success) {
        toast.success(data.message);
        setShowReminderOptions(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    product && (
      <div className="mt-16">
        <p>
          <Link to="/">Home</Link>/<Link to={"/products"}> Products</Link> /
          <Link to={`/ products / ${product.category.toLowerCase()} `}>
            {" "}
            {product.category}
          </Link>{" "}
          /<span className="text-indigo-500"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-4">
          <div className="flex gap-3">
            <div className="flex flex-col gap-3">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className="border max-w-24 border-gray-500/30 rounded overflow-hidden cursor-pointer"
                >
                  <img
                    src={image.startsWith('http') || image.startsWith('data:') || image.startsWith('/') ? image : `http://localhost:5000/images/${image}`}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div >
              ))}
            </div >

            <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
              <img
                src={thumbnail && (thumbnail.startsWith('http') || thumbnail.startsWith('data:') || thumbnail.startsWith('/') ? thumbnail : `http://localhost:5000/images/${thumbnail}`)}
                alt="Selected product"
              />
            </div>
          </div >

          <div className="text-sm w-full md:w-1/2">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-medium">{product.name}</h1>
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`p-2 rounded-full border transition-all ${wishlist.includes(product._id) ? "bg-red-50 border-red-100 text-red-500 shadow-sm" : "bg-gray-50 border-gray-100 text-gray-400 hover:text-red-400"}`}
              >
                <svg
                  className={`w-6 h-6 ${wishlist.includes(product._id) ? "fill-current" : "fill-none"}`}
                  stroke="currentColor"
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
              </button>
            </div>

            <div className="flex items-center gap-0.5 mt-1">
              {Array(5)
                .fill("")
                .map(
                  (_, i) =>
                    product.rating >
                    (
                      <img
                        src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                        alt="star"
                        key={i}
                        className="w-3.5 md:w-4"
                      />
                    )
                )}
              <p className="text-base ml-2">(4)</p>
            </div>

            <div className="mt-6">
              <p className="text-gray-500/70 line-through">
                MRP: ₹{price}
              </p>
              <p className="text-2xl font-medium">MRP: ₹{offerPrice}</p>
              <span className="text-gray-500/70">(inclusive of all taxes)</span>
            </div>

            {isWeightBased && (
              <div className="mt-6">
                <p className="text-base font-medium mb-3">Select Weight</p>
                <div className="flex flex-wrap gap-2">
                  {weightOptions.map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setSelectedWeight(weight)}
                      className={`px-4 py-2 rounded-md border font-medium transition-all ${selectedWeight === weight
                        ? "bg-indigo-500 text-white border-indigo-500 shadow-md"
                        : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                        }`}
                    >
                      {weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p className="text-base font-medium mt-6">About Product</p>
            <ul className="list-disc ml-4 text-gray-500/70">
              {product.description.map((desc, index) => (
                <li key={index}>{desc}</li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 mt-10">
              <div className="flex items-center gap-4 text-base">
                <button
                  onClick={() => addToCart(product._id, isWeightBased ? selectedWeight : null)}
                  className="w-full py-3.5 cursor-pointer font-medium bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    addToCart(product._id, isWeightBased ? selectedWeight : null);
                    navigate("/cart");
                    scrollTo(0, 0);
                  }}
                  className="w-full py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
                >
                  Buy now
                </button>
              </div>

              {/* Reminder Section */}
              {!showReminderOptions ? (
                <button
                  onClick={() => setShowReminderOptions(true)}
                  className="w-full py-3 cursor-pointer font-medium border-2 border-indigo-500 text-indigo-600 rounded hover:bg-indigo-50 transition flex items-center justify-center gap-2"
                >
                  <span>🔔</span> Remind Me to Restock
                </button>
              ) : (
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 animate-fade-in">
                  <p className="font-semibold text-indigo-800 mb-2">Set Reminder Frequency:</p>
                  <div className="flex gap-2 mb-3">
                    {['Daily', 'Weekly', 'Monthly'].map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setReminderFrequency(freq)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${reminderFrequency === freq
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
                          }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSetReminder}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded text-sm hover:bg-indigo-700"
                    >
                      Set Reminder
                    </button>
                    <button
                      onClick={() => setShowReminderOptions(false)}
                      className="px-3 bg-gray-200 text-gray-600 rounded text-sm hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div >
        {/* related prodcuts  */}
        < div className="flex flex-col items-center mt-20" >
          <div className="flex flex-col items-center w-max">
            <p className="text-2xl font-medium">Related Products</p>
            <div className="w-20 h-0.5 bg-primary rounded-full mt-2"></div>
          </div>

          <div className="my-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-center justify-center">
            {relatedProducts
              .filter((product) => product.inStock)
              .map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
          </div>
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="w-1/2 my-8 py-3.5 cursor-pointer font-medium bg-indigo-500 text-white hover:bg-indigo-600 transition"
          >
            See More
          </button>
        </div >
      </div >
    )
  );
};
export default SingleProduct;
