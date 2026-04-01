import { Outlet, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {
    const navigate = useNavigate();
    const { axios, setIsSeller } = useAppContext();

    const logout = async () => {
        try {
            const { data } = await axios.get("/api/seller/logout");
            if (data.success) {
                setIsSeller(false);
                navigate("/home");
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-sm border-r border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-indigo-600">Seller Panel</h2>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => navigate("/seller")}
                                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                                📊 Dashboard
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate("/seller/products")}
                                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                                📦 My Products
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate("/seller/orders")}
                                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                                🛍️ Orders
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => navigate("/seller/profile")}
                                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                                👤 Profile
                            </button>
                        </li>
                        <li className="pt-4 border-t border-gray-200">
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-red-500"
                            >
                                🚪 Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default SellerLayout;
