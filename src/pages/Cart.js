import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { dummyAddress, dummyProducts, noodlesPastaProducts, ketchupDipsSpreadsProducts, chocolateSweetsProducts, masalasSpicesProducts, breakfastEssentials, bakingEssentialsProducts } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";
const Cart = () => {
  const {
    products,
    navigate,
    cartCount,
    totalCartAmount,
    cartItems,
    setCartItems,
    removeFromCart,
    updateCartItem,
    addToCart,
    axios,
    user,
  } = useAppContext();

  // Parse cart key logic (shared)
  const parseCartKey = (key) => {
    if (key.includes('_')) {
      const [itemId, weight] = key.split('_');
      return { itemId, weight };
    }
    return { itemId: key, weight: null };
  };

  // state to store the products available in cart
  const [cartArray, setCartArray] = useState([]);
  // state to address
  const [address, setAddress] = useState([]);
  const [showAddress, setShowAddress] = useState(false);
  // state for selected address
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentOption, setPaymentOption] = useState("COD");

  // state for eco-friendly options
  const [isPlasticFree, setIsPlasticFree] = useState(false);
  const [bringOwnBag, setBringOwnBag] = useState(false);

  const getCart = () => {
    let tempArray = [];
    const allStaticProducts = [
      ...dummyProducts,
      ...noodlesPastaProducts,
      ...ketchupDipsSpreadsProducts,
      ...chocolateSweetsProducts,
      ...masalasSpicesProducts,
      ...breakfastEssentials,
      ...bakingEssentialsProducts
    ];

    for (const cartKey in cartItems) {
      const { itemId, weight } = parseCartKey(cartKey);
      let productsFound = products.find((p) => p._id === itemId);

      if (!productsFound) {
        productsFound = allStaticProducts.find((p) => p._id === itemId);
      }

      if (productsFound) {
        const product = structuredClone(productsFound);
        product.quantity = cartItems[cartKey];
        product.cartKey = cartKey;
        product.selectedWeight = weight;

        // Calculate proportional price if weight exists
        if (weight) {
          const baseWeightMatch = product.name.match(/(\d+)\s*(g|kg)/i);
          if (baseWeightMatch) {
            const baseVal = parseFloat(baseWeightMatch[1]);
            const baseUnit = baseWeightMatch[2].toLowerCase();
            const baseInGrams = baseUnit === 'kg' ? baseVal * 1000 : baseVal;

            const selectedWeightMatch = weight.match(/(\d+)\s*(g|kg)/i);
            if (selectedWeightMatch) {
              const selectedVal = parseFloat(selectedWeightMatch[1]);
              const selectedUnit = selectedWeightMatch[2].toLowerCase();
              const selectedInGrams = selectedUnit === 'kg' ? selectedVal * 1000 : selectedVal;

              const scaleFactor = selectedInGrams / baseInGrams;
              product.offerPrice = Math.round(product.offerPrice * scaleFactor);
              product.price = Math.round(product.price * scaleFactor);
            }
          }
        }

        tempArray.push(product);
      }
    }
    setCartArray(tempArray);
  };

  const getAddress = async () => {
    try {
      const { data } = await axios.get("/api/address/get");
      if (data.success) {
        setAddress(data.addresses);
        if (data.addresses.length > 0) {
          setSelectedAddress(data.addresses[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (user) {
      getAddress();
    }
  }, [user]);

  useEffect(() => {
    if (products.length > 0 && cartItems) {
      getCart();
    }
  }, [products, cartItems]);
  const placeOrder = async () => {
    try {
      if (!selectedAddress) {
        return toast.error("Please select an address");
      }

      const orderPayload = {
        items: cartArray.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        address: selectedAddress._id,
        isPlasticFree,
        bringOwnBag
      };

      // place order with cod
      if (paymentOption === "COD") {
        const { data } = await axios.post("/api/order/cod", orderPayload);
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      }

      // place order with stripe
      if (paymentOption === "Online") {
        const { data } = await axios.post("/api/order/stripe", orderPayload);
        if (data.success) {
          const { session_url } = data;
          window.location.replace(session_url);
        } else {
          toast.error(data.message);
        }
      }
      // place order with mock payment
      if (paymentOption === "Mock") {
        const { data } = await axios.post("/api/order/mock", orderPayload);
        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/my-orders");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    }
  };

  // Calculate final total locally for display
  const calculateFinalTotal = () => {
    let total = totalCartAmount();
    // Apply bag discount before tax or based on business logic? 
    // Backend applies discount then tax. Let's match backend.
    if (bringOwnBag) {
      total -= 10;
      if (total < 0) total = 0;
    }
    const tax = (total * 2) / 100;
    return total + tax;
  };

  return products.length > 0 && cartItems ? (
    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
      <div className="flex-1 max-w-4xl">
        <h1 className="text-3xl font-medium mb-6">
          Shopping Cart{" "}
          <span className="text-sm text-indigo-500">{cartCount()} Items</span>
        </h1>

        <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
          <p className="text-left">Product Details</p>
          <p className="text-center">Subtotal</p>
          <p className="text-center">Action</p>
        </div>

        {cartArray.map((product, index) => (
          <div
            key={index}
            className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3"
          >
            <div className="flex items-center md:gap-6 gap-3">
              <div
                onClick={() => {
                  navigate(`product / ${product.category}/${product._id}`);
                  scrollTo(0, 0);
                }}
                className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded cusror-pointer"
              >
                <img
                  className="max-w-full h-full object-cover"
                  src={product.image[0].startsWith('http') || product.image[0].startsWith('data:') || product.image[0].startsWith('/') ? product.image[0] : `${import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://grocify-backend-1.onrender.com')}/images/${product.image[0]}`}
                  alt={product.name}
                />
              </div >
              <div>
                <p className="hidden md:block font-semibold">{product.name}</p>
                <div className="font-normal text-gray-500/70">
                  <p>
                    Weight: <span>{product.selectedWeight || "N/A"}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <p>Qty:</p>
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <button
                        onClick={() => removeFromCart(product.cartKey)}
                        className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-3 py-0.5 min-w-[30px] text-center bg-white">
                        {product.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(product._id, product.selectedWeight)}
                        className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div >
            <p className="text-center">
              ₹{product.offerPrice * product.quantity}
            </p>
            <button
              onClick={() => {
                const cartData = structuredClone(cartItems);
                delete cartData[product.cartKey];
                setCartItems(cartData);
                toast.success("Item removed");
              }}
              className="cursor-pointer mx-auto"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m12.5 7.5-5 5m0-5 5 5m5.833-2.5a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0"
                  stroke="#FF532E"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div >
        ))}

        <button
          onClick={() => navigate("/products")}
          className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium"
        >
          <svg
            width="15"
            height="11"
            viewBox="0 0 15 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1"
              stroke="#615fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Continue Shopping
        </button>
      </div >
      <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
        <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
        <hr className="border-gray-300 my-5" />
        <div className="mb-6">
          <p className="text-sm font-medium uppercase">Delivery Address</p>
          <div className="relative flex justify-between items-start mt-2">
            <p className="text-gray-500">
              {selectedAddress
                ? `${selectedAddress.street},${selectedAddress.city},${selectedAddress.state},${selectedAddress.landmark}`
                : "No Address Found"}
            </p>
            <button
              onClick={() => setShowAddress(!showAddress)}
              className="text-indigo-500 hover:underline cursor-pointer"
            >
              Change
            </button>
            {showAddress && (
              <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                {address.map((address, index) => (
                  <p
                    key={index}
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowAddress(false);
                    }}
                    className="text-gray-500 p-2 hover:bg-gray-100"
                  >
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.landmark},
                  </p>
                ))}
                <p
                  onClick={() => navigate("/add-address")}
                  className="text-indigo-500 text-center cursor-pointer p-2 hover:bg-indigo-500/10"
                >
                  Add address
                </p>
              </div>
            )}
          </div>

          {/* Eco-Friendly Section */}
          <p className="text-sm font-medium uppercase mt-6 mb-2">Eco-Friendly Options 🌍</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                checked={isPlasticFree}
                onChange={(e) => setIsPlasticFree(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              Plastic-free packaging
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
              <input
                type="checkbox"
                checked={bringOwnBag}
                onChange={(e) => setBringOwnBag(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              Bring your own bag (-₹10)
            </label>
          </div>

          <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

          <select
            onChange={(e) => setPaymentOption(e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none"
          >
            <option value="COD">Cash On Delivery</option>
            <option value="Online">Online Payment</option>
            <option value="Mock">Mock Payment (Skip Stripe)</option>
          </select>
        </div>

        <hr className="border-gray-300" />

        <div className="text-gray-500 mt-4 space-y-2">
          <p className="flex justify-between">
            <span>Price</span>
            <span>₹{totalCartAmount()}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span>
            <span className="text-green-600">Free</span>
          </p>
          {bringOwnBag && (
            <p className="flex justify-between text-green-600">
              <span>Eco Discount</span>
              <span>-₹10</span>
            </p>
          )}
          <p className="flex justify-between">
            <span>Tax (2%)</span>
            <span>₹{Math.floor((bringOwnBag ? Math.max(0, totalCartAmount() - 10) : totalCartAmount()) * 2 / 100)}</span>
          </p>
          <p className="flex justify-between text-lg font-medium mt-3">
            <span>Total Amount:</span>
            <span>₹{calculateFinalTotal()}</span>
          </p>
        </div>

        <button
          onClick={placeOrder}
          disabled={cartArray.length === 0}
          className={`w-full py-3 mt-6 font-medium transition ${cartArray.length === 0
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer"
            }`}
        >
          {paymentOption === "COD" ? "Place Order" : paymentOption === "Mock" ? "Pay via Mock" : "Proceed to Checkout"}
        </button>
      </div>
    </div >
  ) : null;
};
export default Cart;
