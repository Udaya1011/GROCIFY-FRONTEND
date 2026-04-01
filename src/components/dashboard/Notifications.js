const Notifications = () => {
    const notifications = [
        { id: 1, title: "Order Confirmed", message: "Your order #GR12345 has been confirmed and is being packed.", time: "2 hours ago", type: "order" },
        { id: 2, title: "Price Drop Alert", message: "An item in your wishlist 'Basmati Rice' just dropped in price!", time: "5 hours ago", type: "offer" },
        { id: 3, title: "New Offer", message: "Use code SAVE20 for 20% off on your next purchase.", time: "1 day ago", type: "system" },
    ];

    const getIcon = (type) => {
        switch (type) {
            case "order": return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />;
            case "offer": return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />;
            default: return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h2>
            <div className="space-y-4">
                {notifications.map((n) => (
                    <div key={n.id} className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${n.type === 'order' ? 'bg-green-100 text-green-600' :
                                n.type === 'offer' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {getIcon(n.type)}
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{n.title}</h3>
                                <span className="text-xs text-gray-400 font-medium italic">{n.time}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{n.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
