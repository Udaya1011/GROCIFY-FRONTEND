import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import MyOrders from "./MyOrders";
import Wishlist from "../components/dashboard/Wishlist";
import SavedAddresses from "../components/dashboard/SavedAddresses";
import Coupons from "../components/dashboard/Coupons";
import Notifications from "../components/dashboard/Notifications";
import DashboardOverview from "../components/dashboard/DashboardOverview";

const UserDashboard = () => {
    const { user } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get("tab");
        if (tab) {
            setActiveTab(tab);
        }
    }, [location]);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-2xl font-semibold text-gray-700">Please login to view your account</h2>
                <button
                    onClick={() => navigate('/login')}
                    className="mt-4 bg-indigo-500 text-white px-8 py-2 rounded-lg hover:bg-indigo-600 transition"
                >
                    Login
                </button>
            </div>
        );
    }

    const tabs = [
        { id: "overview", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
        { id: "orders", label: "My Orders", icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
        { id: "wishlist", label: "Wishlist", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
        { id: "addresses", label: "Saved Addresses", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
        { id: "coupons", label: "Offers & Coupons", icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" },
        { id: "notifications", label: "Notifications", icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" },
    ];

    return (
        <div className="mt-12 md:mt-16 container mx-auto px-4 md:px-0">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                                {user.name[0].toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 italic">Hello,</p>
                                <p className="font-bold text-gray-800">{user.name}</p>
                            </div>
                        </div>

                        <nav className="p-4 space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        navigate(`/my-account?tab=${tab.id}`);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                            ? "bg-indigo-500 text-white shadow-md shadow-indigo-100"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}></path>
                                    </svg>
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-h-[600px]">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {activeTab === "overview" && <DashboardOverview setActiveTab={(tab) => {
                            setActiveTab(tab);
                            navigate(`/my-account?tab=${tab}`);
                        }} />}
                        {activeTab === "orders" && <MyOrders />}
                        {activeTab === "wishlist" && <Wishlist />}
                        {activeTab === "addresses" && <SavedAddresses />}
                        {activeTab === "coupons" && <Coupons />}
                        {activeTab === "notifications" && <Notifications />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
