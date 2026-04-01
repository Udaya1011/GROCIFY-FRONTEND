import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const DeliveryLayout = () => {
    const { deliveryBoy, setDeliveryBoy, axios, navigate } = useAppContext();

    const sidebarLinks = [
        { name: "Dashboard", path: "/delivery/dashboard", icon: assets.order_icon },
        { name: "Assigned Orders", path: "/delivery/assigned", icon: assets.order_icon },
        { name: "Delivery History", path: "/delivery/history", icon: assets.order_icon },
        { name: "Profile", path: "/delivery/profile", icon: assets.profile_icon },
    ];

    const logout = async () => {
        try {
            const { data } = await axios.get("/api/delivery/logout");
            if (data.success) {
                setDeliveryBoy(null);
                toast.success("Logged out successfully");
                navigate("/delivery/login");
            }
        } catch (error) {
            toast.error("Failed to logout");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white sticky top-0 z-20 shadow-sm">
                <Link to={"/home"}>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-800">Grocify <span className="text-indigo-600">Delivery</span></h1>
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-bold text-gray-900 leading-none">{deliveryBoy?.name}</p>
                        <p className="text-[10px] text-indigo-500 uppercase tracking-widest font-black mt-1">Delivery Agent</p>
                    </div>
                    <button
                        onClick={logout}
                        className="border-2 border-gray-100 hover:border-red-100 hover:bg-red-50 hover:text-red-600 rounded-xl text-xs font-black px-4 py-2 cursor-pointer transition-all uppercase tracking-widest"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex flex-col bg-white overflow-y-auto">
                    {sidebarLinks.map((item) => (
                        <NavLink
                            to={item.path}
                            key={item.name}
                            end={item.path === "/delivery/dashboard"}
                            className={({ isActive }) => `flex items-center py-4 px-4 gap-3 transition-all
                ${isActive
                                    ? "border-r-4 md:border-r-[6px] bg-indigo-50 text-indigo-600 border-indigo-600"
                                    : "hover:bg-gray-50 text-gray-500 border-transparent"
                                }`}
                        >
                            <img src={item.icon} alt="" className="w-6 h-6 opacity-70 group-hover:opacity-100" />
                            <p className="md:block hidden font-bold text-sm">{item.name}</p>
                        </NavLink>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DeliveryLayout;
