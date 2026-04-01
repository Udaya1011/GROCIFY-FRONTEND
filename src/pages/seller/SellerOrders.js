import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerOrders = () => {
    const { axios } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("/api/seller/orders");
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const { data } = await axios.put(`/api/seller/orders/${orderId}/status`, {
                status: newStatus,
            });
            if (data.success) {
                toast.success(data.message);
                fetchOrders();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update order status");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="p-6">Loading orders...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">My Orders</h2>

            {orders.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500">No orders yet</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Items</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm">#{order._id.slice(-6)}</td>
                                        <td className="py-3 px-4 text-sm">{order.userId?.name || "N/A"}</td>
                                        <td className="py-3 px-4 text-sm">{order.items.length} items</td>
                                        <td className="py-3 px-4 text-sm font-medium">₹{order.amount}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${order.status === "Delivered"
                                                    ? "bg-green-100 text-green-700"
                                                    : order.status === "Shipped"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order._id, e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm outline-indigo-500"
                                            >
                                                <option value="Order Placed">Order Placed</option>
                                                <option value="Packing">Packing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Out for delivery">Out for delivery</option>
                                                <option value="Delivered">Delivered</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerOrders;
