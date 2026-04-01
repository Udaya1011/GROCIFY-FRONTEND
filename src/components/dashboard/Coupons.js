const Coupons = () => {
    const availableCoupons = [
        { code: "SAVE20", description: "Get 20% OFF on all orders above ₹500", discount: "20% OFF", expiry: "31 Mar 2026" },
        { code: "GROCIFY100", description: "Flat ₹100 OFF on your first purchase", discount: "₹100 OFF", expiry: "15 Apr 2026" },
        { code: "FLAT50", description: "Flat ₹50 OFF on orders above ₹1000", discount: "₹50 OFF", expiry: "10 May 2026" },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Offers & Coupons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableCoupons.map((coupon) => (
                    <div key={coupon.code} className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-sm group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text- indigo-600 font-bold text-2xl">{coupon.discount}</span>
                                <p className="text-gray-600 text-sm mt-1">{coupon.description}</p>
                            </div>
                            <div className="bg-white px-3 py-1 rounded-full border border-indigo-200 text-indigo-600 text-xs font-bold shadow-sm">
                                VALID THRU {coupon.expiry}
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-white border border-dashed border-indigo-300 rounded-xl p-3 mt-4">
                            <span className="font-mono font-bold text-gray-800 text-lg tracking-widest">{coupon.code}</span>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(coupon.code);
                                    alert("Coupon code copied!");
                                }}
                                className="text-indigo-600 text-sm font-bold hover:underline"
                            >
                                COPY
                            </button>
                        </div>

                        {/* Decoration Circles */}
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-indigo-100 rounded-full"></div>
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-indigo-100 rounded-full"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Coupons;
