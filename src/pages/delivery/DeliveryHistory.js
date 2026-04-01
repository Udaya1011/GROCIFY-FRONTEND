import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const DeliveryHistory = () => {
    const [orders, setOrders] = useState([]);
    const { axios } = useContext(AppContext);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        try {
            const { data } = await axios.get("/api/delivery/orders");
            if (data.success) {
                // Filter only delivered orders
                setOrders(data.orders.filter(o => o.status === 'Delivered'));
            }
        } catch (error) {
            toast.error("Failed to fetch history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Delivery History</h2>
                <p className="text-sm text-gray-500 font-medium">Review your completed delivery tasks</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-300">
                    <div className="mx-auto h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">No History Found</h3>
                    <p className="text-sm text-gray-500 mt-2">Completed deliveries will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                                                #{order._id.slice(-6).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-gray-800">{order.address?.firstName} {order.address?.lastName}</p>
                                            <p className="text-[10px] text-gray-500 font-medium">{order.address?.city}</p>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-bold text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-green-100 inline-block">
                                                Delivered
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-sm font-black text-gray-900">₹{order.amount}</span>
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

export default DeliveryHistory;
