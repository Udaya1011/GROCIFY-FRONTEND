import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SellerDashboard = () => {
    const { axios } = useAppContext();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get("/api/seller/stats");
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            toast.error("Failed to load statistics");
        }
    };

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("/api/seller/orders");
            if (data.success) {
                setOrders(data.orders.slice(0, 5)); // Get latest 5 orders
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        fetchOrders();
    }, []);

    const statCards = [
        { title: "Total Products", value: stats.totalProducts, color: "bg-purple-500", icon: "📦" },
        { title: "Total Orders", value: stats.totalOrders, color: "bg-green-500", icon: "🛍️" },
        { title: "Total Revenue", value: `₹{stats.totalRevenue}`, color: "bg-orange-500", icon: "💰" },
    ];

    if (loading) {
        return <div className="p-6">Loading dashboard...</div>;
    }

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-2xl font-semibold">Seller Dashboard</h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((card, index) => (
                    <div
                        key={index}
                        className={`${card.color} p-6 rounded-xl text-white shadow-lg transform hover:scale-105 transition-all cursor-default`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-80 font-medium mb-1">{card.title}</p>
                                <h3 className="text-3xl font-bold">{card.value}</h3>
                            </div>
                            <span className="text-4xl opacity-80">{card.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Orders</h3>
                {orders.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No orders yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm">#{order._id.slice(-6)}</td>
                                        <td className="py-3 px-4 text-sm">{order.userId?.name || "N/A"}</td>
                                        <td className="py-3 px-4 text-sm font-medium">₹{order.amount}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${order.status === "Delivered" ? "bg-green-100 text-green-700" :
                                                order.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                                                    "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
