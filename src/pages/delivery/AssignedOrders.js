import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AssignedOrders = () => {
    const [orders, setOrders] = useState([]);
    const { axios, deliveryBoy } = useContext(AppContext);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get("/api/delivery/orders");
            if (data.success) {
                // Filter only non-delivered orders
                setOrders(data.orders.filter(o => o.status !== 'Delivered'));
            }
        } catch (error) {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId, status) => {
        try {
            const { data } = await axios.post("/api/delivery/status", { orderId, status });
            if (data.success) {
                toast.success(data.message);
                fetchOrders();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Status update failed");
        }
    };

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Assigned Orders</h2>
                    <p className="text-sm text-gray-500 font-medium">Manage your active delivery tasks</p>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                    <span className="text-indigo-600 font-black text-xs uppercase tracking-widest">{orders.length} ACTIVE</span>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-300">
                    <div className="mx-auto h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl">📦</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No Pending Deliveries</h3>
                    <p className="text-sm text-gray-500 mt-2">You're all caught up! New assignments will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col lg:flex-row justify-between gap-8">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                            <span className="bg-blue-50 text-blue-600 border border-blue-100 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                {order.status}
                                            </span>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Customer Details</p>
                                                    <h3 className="text-xl font-bold text-gray-900 leading-none">
                                                        {order.address?.firstName} {order.address?.lastName}
                                                    </h3>
                                                    <div className="flex items-start gap-2 text-gray-500 mt-2">
                                                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <p className="text-xs font-medium leading-relaxed">
                                                            {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipCode}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        <a href={`tel:${order.address?.phone}`} className="inline-flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl text-xs font-black hover:bg-indigo-100 transition-colors uppercase tracking-widest">
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            Call {order.address?.phone}
                                                        </a>
                                                        {order.address?.lat && order.address?.lng && (
                                                            <a
                                                                href={`https://www.google.com/maps/dir/?api=1&destination=${order.address.lat},${order.address.lng}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl text-xs font-black hover:bg-emerald-100 transition-colors uppercase tracking-widest"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                View on Map
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Order Items</p>
                                                <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-xs font-bold text-gray-700">
                                                            <span>{item.product?.name || 'Unknown Product'} {item.weight ? `(${item.weight})` : ''}</span>
                                                            <span className="text-indigo-600 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">x{item.quantity}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 lg:w-56 justify-center">
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'Picked Up')}
                                            disabled={order.status !== 'Order Confirmed' && order.status !== 'Packed'}
                                            className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${order.status !== 'Order Confirmed' && order.status !== 'Packed'
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                                                }`}
                                        >
                                            Mark Picked Up
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'On the Way')}
                                            disabled={order.status !== 'Picked Up'}
                                            className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${order.status !== 'Picked Up'
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                                : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-100'
                                                }`}
                                        >
                                            On the Way
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                                            disabled={order.status !== 'On the Way'}
                                            className={`w-full py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${order.status !== 'On the Way'
                                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-100'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                                }`}
                                        >
                                            Mark Delivered
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AssignedOrders;
