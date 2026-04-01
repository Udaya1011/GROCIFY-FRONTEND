import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const DeliveryDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        delivered: 0,
        todayEarnings: 0
    });
    const { axios, deliveryBoy } = useContext(AppContext);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const { data } = await axios.get("/api/delivery/orders");
            if (data.success) {
                const orders = data.orders;
                const delivered = orders.filter(o => o.status === 'Delivered');
                const pending = orders.filter(o => o.status !== 'Delivered');

                setStats({
                    total: orders.length,
                    pending: pending.length,
                    delivered: delivered.length,
                    todayEarnings: delivered.reduce((acc, curr) => acc + (curr.amount * 0.05), 0) // Mock 5% commission
                });
            }
        } catch (error) {
            toast.error("Failed to fetch dashboard stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statCards = [
        { title: "Active Tasks", value: stats.pending, color: "bg-blue-600", icon: "🚀", link: "/delivery/assigned" },
        { title: "Total Delivered", value: stats.delivered, color: "bg-emerald-600", icon: "✅", link: "/delivery/history" },
        { title: "Total Missions", value: stats.total, color: "bg-indigo-600", icon: "📦", link: "/delivery/history" },
        { title: "Est. Earnings", value: `₹${Math.floor(stats.todayEarnings)}`, color: "bg-amber-600", icon: "💰", link: "#" },
    ];

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none text-center">Dashboard Overview</h2>
                    <p className="text-sm text-gray-500 font-medium mt-2">Welcome back, {deliveryBoy?.name}!</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
                    <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-black text-gray-600 uppercase tracking-widest">Active Status: Online</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <Link to={card.link} key={index} className={`${card.color} p-6 rounded-3xl text-white shadow-xl shadow-indigo-500/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}>
                        <div className="absolute right-[-10px] top-[-10px] text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                            {card.icon}
                        </div>
                        <p className="text-[10px] uppercase tracking-widest opacity-80 font-black mb-1">{card.title}</p>
                        <h3 className="text-3xl font-black truncate">{card.value}</h3>
                        <div className="mt-4 flex items-center text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details →
                        </div>
                    </Link>
                ))}
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-gray-900 mb-6">Quick Tasks</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <Link to="/delivery/assigned" className="flex items-center gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors group">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">🚚</div>
                        <div>
                            <p className="font-black text-indigo-900 text-sm uppercase tracking-widest">Active Jobs</p>
                            <p className="text-xs text-indigo-600 font-medium">{stats.pending} orders waiting to be delivered</p>
                        </div>
                    </Link>
                    <Link to="/delivery/profile" className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors group">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">👤</div>
                        <div>
                            <p className="font-black text-emerald-900 text-sm uppercase tracking-widest">Your Profile</p>
                            <p className="text-xs text-emerald-600 font-medium">Manage your contact information</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
