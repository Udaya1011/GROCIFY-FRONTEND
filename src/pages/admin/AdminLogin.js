import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const AdminLogin = () => {
    const { setIsAdmin, navigate, axios } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post("/api/admin/login", {
                email,
                password,
            });

            if (data.success) {
                toast.success("Welcome Admin!");
                setIsAdmin(true);
                navigate("/admin/dashboard");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-indigo-100">
                <div>
                    <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                        <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Admin Portal
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please sign in to access the dashboard
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 shadow-sm">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Admin Email</label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
                                placeholder="admin@grocify.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                required
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-md ${loading ? 'opacity-50' : ''}`}
                        >
                            {loading ? "Authenticating..." : "Login to Admin"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
