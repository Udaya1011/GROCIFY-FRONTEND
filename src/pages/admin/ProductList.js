import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";

const ProductList = () => {
  const { products, fetchProducts, axios, categories } = useAppContext();
  const [editingProduct, setEditingProduct] = useState(null);
  const [editData, setEditData] = useState({});

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStock, setFilterStock] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { data } = await axios.post("/api/product/delete", { id });
        if (data.success) {
          fetchProducts();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", editData._id);
      formData.append("name", editData.name);
      formData.append("description", Array.isArray(editData.description) ? editData.description.join(", ") : editData.description);
      formData.append("category", editData.category);
      formData.append("price", editData.price);
      formData.append("offerPrice", editData.offerPrice);
      formData.append("stock", editData.stock);
      formData.append("inStock", editData.inStock);

      const { data } = await axios.post("/api/product/update-product", formData);
      if (data.success) {
        toast.success(data.message);
        setEditingProduct(null);
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Derive unique categories from product list
  const uniqueCategories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))].sort();
    return ["All", ...cats];
  }, [products]);

  // Instant filtered product list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.offerPrice.toString().includes(q) ||
        product.price.toString().includes(q);

      const matchesCategory =
        filterCategory === "All" || product.category === filterCategory;

      const matchesStock =
        filterStock === "All" ||
        (filterStock === "In Stock" && product.inStock) ||
        (filterStock === "Out of Stock" && !product.inStock);

      const price = product.offerPrice;
      const matchesMin = minPrice === "" || price >= Number(minPrice);
      const matchesMax = maxPrice === "" || price <= Number(maxPrice);

      return matchesSearch && matchesCategory && matchesStock && matchesMin && matchesMax;
    });
  }, [products, searchQuery, filterCategory, filterStock, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearchQuery("");
    setFilterCategory("All");
    setFilterStock("All");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasActiveFilters =
    searchQuery || filterCategory !== "All" || filterStock !== "All" || minPrice || maxPrice;

  return (
    <div className="flex-1 py-10 flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Product Management</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
            {filteredProducts.length} of {products.length} products
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm space-y-5">
          {/* Search Input */}
          <div className="relative group">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, category, or price..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition bg-gray-50/50 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            {/* Category Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
              >
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Stock Filter */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Stock Status
              </label>
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
              >
                <option value="All">All Items</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-1.5 lg:col-span-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Price Range (₹)
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="border border-gray-200 rounded-lg pl-3 pr-2 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                  />
                </div>
                <span className="text-gray-300 font-bold">−</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="border border-gray-200 rounded-lg pl-3 pr-2 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-center justify-end">
              {hasActiveFilters ? (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 font-bold px-4 py-2.5 rounded-lg hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-100"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear All
                </button>
              ) : (
                <div className="h-10"></div>
              )}
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm">
          <table className="md:table-auto table-fixed w-full overflow-hidden text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold hidden md:table-cell">Price</th>
                <th className="px-4 py-3 font-semibold text-center">In Stock</th>
                <th className="px-4 py-3 font-semibold text-center">Edit</th>
                <th className="px-4 py-3 font-semibold text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600 divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="border border-gray-200 rounded-lg p-1.5 bg-white flex-shrink-0">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL || (window.location.hostname.includes('onrender.com') ? 'https://grocify-backend-1.onrender.com' : 'http://localhost:5000')}/images/${product.image[0]}`}
                          alt="Product"
                          className="w-14 h-14 object-contain"
                        />
                      </div>
                      <span className="truncate max-sm:hidden font-medium text-gray-800">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell font-semibold text-gray-800">
                      ₹{product.offerPrice}
                      <span className="text-gray-400 ml-1 text-xs line-through font-normal">₹{product.price}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                        <input
                          onClick={() => toggleStock(product._id, !product.inStock)}
                          checked={product.inStock}
                          type="checkbox"
                          className="sr-only peer"
                          readOnly
                        />
                        <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors duration-200"></div>
                        <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5 shadow-sm"></span>
                      </label>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setEditData({ ...product });
                        }}
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-1.5 rounded-lg transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mx-auto">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => deleteProduct(product._id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mx-auto">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                    </svg>
                    <p className="text-sm font-medium">No products match your search.</p>
                    <button onClick={clearFilters} className="mt-2 text-indigo-600 text-sm hover:underline">Clear filters</button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Edit Product: {editingProduct.name}</h3>
            <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">Name</label>
                <input required type="text" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">Description (Comma separated)</label>
                <textarea rows={3} className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={editData.description?.join(", ")} onChange={e => setEditData({ ...editData, description: e.target.value.split(", ") })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Price</label>
                <input required type="number" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={editData.price} onChange={e => setEditData({ ...editData, price: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Offer Price</label>
                <input required type="number" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={editData.offerPrice} onChange={e => setEditData({ ...editData, offerPrice: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
                <select className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={editData.category} onChange={e => setEditData({ ...editData, category: e.target.value })}>
                  {categories.map(cat => <option key={cat.path} value={cat.path}>{cat.path}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Stock</label>
                <input required type="number" className="w-full border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none" value={editData.stock} onChange={e => setEditData({ ...editData, stock: e.target.value })} />
              </div>
              <div className="col-span-2 flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-medium transition">Update Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
