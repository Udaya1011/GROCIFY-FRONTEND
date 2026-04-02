import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories, dummyProducts, noodlesPastaProducts, ketchupDipsSpreadsProducts, chocolateSweetsProducts, picklesChutneyProducts, readyToCookProducts, masalasSpicesProducts, breakfastEssentials, bakingEssentialsProducts, dalPulsesProducts, dryFruitsProducts, snacksProducts, detergentProducts, householdCareProducts, teaCoffeeProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname.includes('onrender.com') ? "https://grocify-backend-1.onrender.com" : "http://localhost:5000");
export const AppContext = createContext(null);

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [deliveryBoy, setDeliveryBoy] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allStaticProducts = [
    ...dummyProducts,
    ...noodlesPastaProducts,
    ...ketchupDipsSpreadsProducts,
    ...chocolateSweetsProducts,
    ...picklesChutneyProducts,
    ...readyToCookProducts,
    ...masalasSpicesProducts,
    ...breakfastEssentials,
    ...bakingEssentialsProducts,
    ...dalPulsesProducts,
    ...dryFruitsProducts,
    ...snacksProducts,
    ...detergentProducts,
    ...householdCareProducts,
    ...teaCoffeeProducts
  ];

  // check admin status
  const fetchAdmin = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-auth");
      if (data.success) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      setIsAdmin(false);
      // Silent in background
    }
  };

  // fetch user auth status ,user Data and cart items
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems || {});
        setWishlist(data.user.wishlist || []);
      }
    } catch (error) {
      // Silent in background
    }
  };

  // check seller status
  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      if (data.success) {
        setIsSeller(true);
        setSeller(data.seller);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      setIsSeller(false);
      // Silent in background
    }
  };

  // check delivery boy status
  const fetchDeliveryBoy = async () => {
    try {
      const { data } = await axios.get("/api/delivery/is-auth");
      if (data.success) {
        setDeliveryBoy(data.deliveryBoy);
      }
    } catch (error) {
      // Silent
    }
  };

  // fetch products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  // helper to parse composite cart keys
  const parseCartKey = (key) => {
    if (key.includes('_')) {
      const [itemId, weight] = key.split('_');
      return { itemId, weight };
    }
    return { itemId: key, weight: null };
  };

  // add product to cart
  const addToCart = (itemId, weight = null) => {
    const cartKey = weight ? `${itemId}_${weight}` : itemId;

    setCartItems(prev => {
      const cartData = structuredClone(prev || {});
      if (cartData[cartKey]) {
        cartData[cartKey] += 1;
      } else {
        cartData[cartKey] = 1;
      }
      return cartData;
    });
    toast.success("Added to cart");
  };

  // update cart item quantity
  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success(`cart updated`);
  };

  // total cart items
  const cartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };
  // total cart amount
  const totalCartAmount = () => {
    let totalAmount = 0;
    for (const cartKey in cartItems) {
      if (cartItems[cartKey] > 0) {
        const { itemId, weight } = parseCartKey(cartKey);

        // Try to find in backend products first, then in static products
        let itemInfo = products.find((product) => product._id === itemId);

        if (!itemInfo) {
          itemInfo = allStaticProducts.find((product) => product._id === itemId);
        }

        if (itemInfo && itemInfo.name) {
          let price = itemInfo.offerPrice || 0;

          // If weight is selected, calculate price proportionally
          if (weight) {
            // Parse base weight from name (e.g., "Potato 500g" -> 500)
            const baseWeightMatch = itemInfo.name.match(/(\d+)\s*(g|kg)/i);
            if (baseWeightMatch) {
              const baseVal = parseFloat(baseWeightMatch[1]);
              const baseUnit = baseWeightMatch[2].toLowerCase();
              const baseInGrams = baseUnit === 'kg' ? baseVal * 1000 : baseVal;

              // Parse selected weight (e.g., "1kg" -> 1000)
              const selectedWeightMatch = weight.match(/(\d+)\s*(g|kg)/i);
              if (selectedWeightMatch) {
                const selectedVal = parseFloat(selectedWeightMatch[1]);
                const selectedUnit = selectedWeightMatch[2].toLowerCase();
                const selectedInGrams = selectedUnit === 'kg' ? selectedVal * 1000 : selectedVal;

                // Scaled price
                if (baseInGrams > 0) {
                  price = (itemInfo.offerPrice / baseInGrams) * selectedInGrams;
                }
              }
            }
          }

          totalAmount += cartItems[cartKey] * price;
        }
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };
  // remove product from cart
  const removeFromCart = (cartKey) => {
    setCartItems(prev => {
      const cartData = structuredClone(prev || {});
      if (cartData[cartKey]) {
        cartData[cartKey] -= 1;
        if (cartData[cartKey] === 0) {
          delete cartData[cartKey];
        }
        toast.success(`remove from cart`);
      }
      return cartData;
    });
  };

  // central logout function
  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");
      if (data.success) {
        setUser(null);
        setCartItems({});
        setWishlist([]);
        setIsAdmin(false);
        setIsSeller(false);
        setSeller(null);
        setDeliveryBoy(null);
        navigate("/home");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // wishlist logic
  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error("Please login to use wishlist");
      return;
    }
    try {
      const isWishlisted = wishlist.includes(productId);
      const url = isWishlisted ? "/api/wishlist/remove" : "/api/wishlist/add";
      const { data } = await axios.post(url, { productId });
      if (data.success) {
        setWishlist(prev =>
          isWishlisted
            ? prev.filter(id => id !== productId)
            : [...prev, productId]
        );
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await axios.get("/api/wishlist/get");
      if (data.success) {
        setWishlist(data.wishlist);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAdmin();
    fetchSeller();
    fetchProducts();
    fetchUser();
    fetchDeliveryBoy();
  }, []);

  // Check for reminders on login
  useEffect(() => {
    const checkReminders = async () => {
      try {
        const { data } = await axios.get("/api/reminder/check");
        if (data.success && data.reminders.length > 0) {
          data.reminders.forEach((rem) => {
            toast(rem.message, {
              icon: "🔔",
              duration: 6000,
            });
          });
        }
      } catch (error) {
        console.error("Error checking reminders:", error);
      }
    };

    if (user) {
      checkReminders();
    }
  }, [user]);

  // update database cart items
  useEffect(() => {
    const updateCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", { cartItems });

        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    if (user) {
      updateCart();
    }
  }, [cartItems]);
  const value = {
    navigate,
    user,
    setUser,
    isAdmin,
    setIsAdmin,
    isSeller,
    setIsSeller,
    seller,
    setSeller,
    products,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    cartCount,
    totalCartAmount,
    axios,
    fetchProducts,
    showUserLogin,
    setShowUserLogin,
    wishlist,
    setWishlist,
    toggleWishlist,
    fetchWishlist,
    setCartItems,
    categories,
    deliveryBoy,
    setDeliveryBoy,
    allStaticProducts,
    fetchUser,
    logout,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
