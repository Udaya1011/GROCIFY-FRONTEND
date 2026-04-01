import { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DeliveryLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { axios, setDeliveryBoy } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/delivery/login", { email, password });
            if (data.success) {
                toast.success(data.message);
                setDeliveryBoy(data.deliveryBoy);
                navigate("/delivery/dashboard");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Delivery Login</h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">Log in to manage your assigned orders</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                                placeholder="delivery@grocify.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-black rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-200 uppercase tracking-widest"
                        >
                            Start Delivering
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeliveryLogin;
