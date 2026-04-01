import { useAppContext } from "../../context/AppContext";

const DashboardOverview = ({ setActiveTab }) => {
    const { user, wishlist, cartCount } = useAppContext();

    const stats = [
        { label: "My Orders", value: "2", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", tab: "orders", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Wishlist", value: wishlist.length.toString(), icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", tab: "wishlist", color: "text-red-600", bg: "bg-red-50" },
        { label: "Notifications", value: "3", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", tab: "notifications", color: "text-indigo-600", bg: "bg-indigo-50" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">Welcome back, {user.name}!</h2>
                <p className="text-gray-500 mt-1 italic">Here's what's happening with your account today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        onClick={() => setActiveTab(stat.tab)}
                        className="bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer group"
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}></path>
                            </svg>
                        </div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-3xl font-black text-gray-800 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-500/20">
                <div className="relative z-10 w-2/3">
                    <h3 className="text-2xl font-black mb-2">Exclusive Offer Just For You!</h3>
                    <p className="text-white/80 text-sm mb-6 max-w-sm italic">Get an extra 20% off on your next purchase of fresh organic vegetables. Limited time offer!</p>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl font-mono font-bold tracking-widest text-lg border border-white/30">
                            FRESH20
                        </div>
                        <button
                            onClick={() => setActiveTab("coupons")}
                            className="px-6 py-2 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg active:scale-95"
                        >
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Abstract shapes for premium feel */}
                <div className="absolute top-1/2 right-10 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                <svg className="absolute -right-20 -bottom-20 w-80 h-80 text-white/10 group-hover:rotate-12 transition-transform duration-1000" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
            </div>

            {/* Recommended Section Placeholder */}
            <div className="border-t border-gray-100 pt-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Recommended for You</h3>
                    <button className="text-indigo-600 text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-100 italic">
                    <p className="text-gray-400">Based on your recent activity, we'll start showing personalized recommendations here.</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
