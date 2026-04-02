import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Inventory = () => {
    const { products, fetchProducts, axios } = useAppContext();
    const [updating, setUpdating] = useState(null);

    const updateStockValue = async (id, newStock) => {
        setUpdating(id);
        try {
            const { data } = await axios.post("/api/product/update-product", { id, stock: newStock });
            if (data.success) {
                fetchProducts();
                toast.success("Stock updated");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Inventory Management</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-700 font-medium text-sm">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Current Stock</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products.map((product) => (
                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3 text-sm font-medium text-gray-900">
                                    <img src={`${import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://grocify-backend-1.onrender.com')}/images/${product.image[0]}`} className="w-10 h-10 rounded object-cover" alt="" />
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <input
                                        type="number"
                                        defaultValue={product.stock}
                                        onBlur={(e) => updateStockValue(product._id, e.target.value)}
                                        className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                        disabled={updating === product._id}
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {product.stock <= 5 ? (
                                        <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Low Stock</span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">In Stock</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <button
                                        onClick={() => updateStockValue(product._id, 0)}
                                        className="text-red-600 hover:text-red-800 font-medium"
                                    >
                                        Out of Stock
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
