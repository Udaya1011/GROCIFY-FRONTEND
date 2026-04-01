import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerProducts = () => {
    const { axios, navigate } = useAppContext();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get("/api/seller/products");
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const { data } = await axios.delete(`/api/seller/products/${id}`);
            if (data.success) {
                toast.success(data.message);
                fetchProducts();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
        return <div className="p-6">Loading products...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">My Products</h2>
                <button
                    onClick={() => navigate("/seller/products/add")}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    + Add Product
                </button>
            </div>

            {products.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500 mb-4">You haven't added any products yet</p>
                    <button
                        onClick={() => navigate("/seller/products/add")}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Add Your First Product
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <img
                                src={product.image[0]}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {product.description[0]}
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <span className="text-lg font-bold text-indigo-600">
                                            ₹{product.offerPrice}
                                        </span>
                                        {product.price !== product.offerPrice && (
                                            <span className="text-sm text-gray-400 line-through ml-2">
                                                ₹{product.price}
                                            </span>
                                        )}
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs ${product.inStock
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {product.inStock ? "In Stock" : "Out of Stock"}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/seller/products/edit/${product._id}`)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors text-sm"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(product._id)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors text-sm"
                                    >
                                        Delete
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

export default SellerProducts;
