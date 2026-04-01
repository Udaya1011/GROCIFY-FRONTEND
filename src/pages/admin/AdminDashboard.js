import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const AdminDashboard = () => {
    const { axios, products, navigate } = useAppContext();
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        totalRevenue: 0,
        totalIssues: 0,
        avgOrderValue: 0
    });
    const [analytics, setAnalytics] = useState(null);
    const [viewPeriod, setViewPeriod] = useState('daily'); // 'daily', 'weekly', 'monthly'
    const [orders, setOrders] = useState([]);
    const [deliveryBoys, setDeliveryBoys] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            // Fetch users count
            const userDataReq = axios.get("/api/admin/users").catch(e => ({ data: { success: false } }));
            // Fetch orders
            const orderDataReq = axios.get("/api/order/admin").catch(e => ({ data: { success: false } }));
            // Fetch issues
            const issueDataReq = axios.get("/api/issue/admin/all").catch(e => ({ data: { success: false } }));
            // Fetch delivery boys
            const deliveryBoysReq = axios.get("/api/admin/delivery/list").catch(e => ({ data: { success: false } }));

            const [userRes, orderRes, issueRes, deliveryBoysRes] = await Promise.all([userDataReq, orderDataReq, issueDataReq, deliveryBoysReq]);
            const userData = userRes.data;
            const orderData = orderRes.data;
            const issueData = issueRes.data;

            if (userData?.success && orderData?.success && issueData?.success) {
                const analyticsDataReq = await axios.get("/api/order/analytics").catch(e => ({ data: { success: false } }));
                const analyticsData = analyticsDataReq.data;

                if (analyticsData?.success) {
                    setAnalytics(analyticsData.charts);
                    const allOrders = orderData.orders || [];
                    setOrders(allOrders);
                    setDeliveryBoys(deliveryBoysRes.data?.deliveryBoys || []);
                    setStats({
                        totalUsers: userData.users?.length || 0,
                        totalOrders: analyticsData.metrics?.totalOrders || 0,
                        totalProducts: products?.length || 0,
                        totalRevenue: analyticsData.metrics?.totalRevenue || 0,
                        totalIssues: issueData.issues?.length || 0,
                        avgOrderValue: analyticsData.metrics?.avgOrderValue || 0
                    });
                } else {
                    // Fallback to manual calculation if analytics fails
                    const allOrders = orderData.orders || [];
                    setOrders(allOrders);
                    setDeliveryBoys(deliveryBoysRes.data?.deliveryBoys || []);
                    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
                    setStats({
                        totalUsers: userData.users?.length || 0,
                        totalOrders: allOrders.length,
                        totalProducts: products?.length || 0,
                        totalRevenue: Math.floor(totalRevenue * 100) / 100,
                        totalIssues: issueData.issues?.length || 0,
                        avgOrderValue: allOrders.length > 0 ? totalRevenue / allOrders.length : 0
                    });
                }
            } else {
                console.warn("One or more dashboard data sources failed to load");
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            toast.error("Failed to load dashboard statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [products]);

    const handleAssignDelivery = async (orderId, deliveryBoyId) => {
        try {
            const { data } = await axios.post("/api/admin/order/assign", {
                orderId,
                deliveryBoyId,
            });
            if (data.success) {
                toast.success(data.message);
                await fetchStats();
            }
        } catch (error) {
            toast.error("Assignment failed");
        }
    };

    const statCards = [
        {
            title: "Total Users", value: stats.totalUsers, color: "bg-blue-600", icon: (
                <svg className="w-8 h-8 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
            )
        },
        {
            title: "Total Orders", value: stats.totalOrders, color: "bg-emerald-600", icon: (
                <svg className="w-8 h-8 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
            )
        },
        {
            title: "Total Products", value: stats.totalProducts, color: "bg-indigo-600", icon: (
                <svg className="w-8 h-8 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>
            )
        },
        {
            title: "Total Revenue", value: `₹${stats.totalRevenue}`, color: "bg-amber-600", icon: (
                <svg className="w-8 h-8 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path></svg>
            )
        },
        {
            title: "Total Issues", value: stats.totalIssues, color: "bg-rose-600", icon: (
                <svg className="w-8 h-8 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
            )
        },
    ];

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
            <header className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h2>
                <span className="text-sm text-gray-500 font-medium">{new Date().toDateString()}</span>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {statCards.map((card, index) => (
                    <div key={index} className={`${card.color} p-6 rounded-2xl text-white shadow-xl shadow-indigo-500/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}>
                        <div className="absolute right-[-10px] top-[-10px] group-hover:scale-110 transition-transform duration-500">
                            {card.icon}
                        </div>
                        <p className="text-xs uppercase tracking-wider opacity-80 font-bold mb-1">{card.title}</p>
                        <h3 className="text-3xl font-black truncate">{card.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Sales Performance</h3>
                            <p className="text-sm text-gray-500">Revenue trends over time</p>
                        </div>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            {['daily', 'weekly', 'monthly'].map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setViewPeriod(period)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all capitalize ${viewPeriod === period ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics ? analytics[viewPeriod] : []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                                    dy={10}
                                    tickFormatter={(val) => {
                                        if (viewPeriod === 'daily') return val.split('-').slice(1).join('/');
                                        return val;
                                    }}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 10 }} tickFormatter={(val) => `₹${val}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`₹${value}`, 'Revenue']}
                                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                                />
                                <Bar dataKey="revenue" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={viewPeriod === 'daily' ? 12 : 30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
                        <h3 className="text-lg font-semibold mb-6 text-gray-800">Advanced Metrics</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-indigo-50 rounded-xl">
                                <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mb-1">Avg. Order Value</p>
                                <p className="text-2xl font-black text-indigo-900">₹{stats.avgOrderValue}</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-xl">
                                <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">Growth Rate</p>
                                <p className="text-2xl font-black text-emerald-900">+12.5%</p>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm font-medium text-gray-700 mb-3">Goal Progress</p>
                                <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
                                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <p className="text-right text-xs text-gray-500 font-medium">75% of Monthly Goal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">New Orders (Unassigned)</h3>
                    <button onClick={() => navigate('/admin/orders')} className="text-indigo-600 text-sm font-bold hover:underline">View All Orders</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Assign Delivery</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.filter(o => o.status === "Order Placed" && !o.deliveryBoyId).length > 0 ? (
                                orders.filter(o => o.status === "Order Placed" && !o.deliveryBoyId).slice(0, 5).map(order => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 text-sm font-black text-indigo-600">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="py-4">
                                            <p className="text-sm font-bold text-gray-800">{order.address?.firstName} {order.address?.lastName}</p>
                                            <p className="text-xs text-gray-500">{order.address?.city}</p>
                                        </td>
                                        <td className="py-4 font-black text-gray-900">₹{order.amount}</td>
                                        <td className="py-4">
                                            <select
                                                onChange={(e) => handleAssignDelivery(order._id, e.target.value)}
                                                className="text-[10px] font-black bg-indigo-50 border-none text-indigo-600 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-400 outline-none cursor-pointer uppercase tracking-widest"
                                            >
                                                <option value="">Choose Agent</option>
                                                {deliveryBoys.map((boy) => (
                                                    <option key={boy._id} value={boy._id}>
                                                        {boy.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-10 text-center text-gray-400 text-sm">No new orders to assign</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => navigate('/admin/product-list')} className="flex flex-col items-center justify-center p-4 border border-indigo-100 rounded-xl hover:bg-indigo-50 transition-all group">
                        <span className="text-indigo-600 font-semibold mb-1 group-hover:scale-110 transition-transform">Products</span>
                        <span className="text-xs text-gray-500 text-center">Manage inventory</span>
                    </button>
                    <button onClick={() => navigate('/admin/orders')} className="flex flex-col items-center justify-center p-4 border border-green-100 rounded-xl hover:bg-green-50 transition-all group">
                        <span className="text-green-600 font-semibold mb-1 group-hover:scale-110 transition-transform">Orders</span>
                        <span className="text-xs text-gray-500 text-center">Track shipments</span>
                    </button>
                    <button onClick={() => navigate('/admin/users')} className="flex flex-col items-center justify-center p-4 border border-blue-100 rounded-xl hover:bg-blue-50 transition-all group">
                        <span className="text-blue-600 font-semibold mb-1 group-hover:scale-110 transition-transform">Users</span>
                        <span className="text-xs text-gray-500 text-center">Manage accounts</span>
                    </button>
                    <button onClick={() => navigate('/admin/issues')} className="flex flex-col items-center justify-center p-4 border border-red-100 rounded-xl hover:bg-red-50 transition-all group">
                        <span className="text-red-600 font-semibold mb-1 group-hover:scale-110 transition-transform">Issues</span>
                        <span className="text-xs text-gray-500 text-center">Customer support</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
