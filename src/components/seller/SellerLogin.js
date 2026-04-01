import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import React, { useState, useEffect } from "react";

const SellerLogin = () => {
    const { isSeller, setIsSeller, navigate, axios } = useAppContext();
    const [state, setState] = useState("login"); // 'login' or 'register'
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [shopName, setShopName] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        if (isSeller) {
            navigate("/seller");
        }
    }, [isSeller]);

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            const endpoint = state === "login" ? "/api/seller/login" : "/api/seller/register";
            const payload = state === "login"
                ? { email, password }
                : { name, email, password, shopName, phone };

            const { data } = await axios.post(endpoint, payload);

            if (data.success) {
                toast.success(data.message);
                if (state === "login") {
                    setIsSeller(true);
                    navigate("/seller");
                } else {
                    // After registration, switch to login
                    setState("login");
                    setName("");
                    setPassword("");
                    setShopName("");
                    setPhone("");
                }
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        !isSeller && (
            <div className="fixed top-0 left-0 bottom-0 right-0 z-30 flex items-center justify-center bg-black/50 text-gray-600">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[400px] rounded-lg shadow-xl border border-gray-200 bg-white max-h-[90vh] overflow-y-auto"
                >
                    <p className="text-2xl font-medium m-auto">
                        <span className="text-indigo-500">Seller</span>{" "}
                        {state === "login" ? "Login" : "Register"}
                    </p>

                    {state === "register" && (
                        <>
                            <div className="w-full">
                                <p>Name</p>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    placeholder="Your name"
                                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                                    type="text"
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <p>Shop Name</p>
                                <input
                                    onChange={(e) => setShopName(e.target.value)}
                                    value={shopName}
                                    placeholder="Your shop name"
                                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                                    type="text"
                                    required
                                />
                            </div>
                            <div className="w-full">
                                <p>Phone</p>
                                <input
                                    onChange={(e) => setPhone(e.target.value)}
                                    value={phone}
                                    placeholder="Your phone number"
                                    className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                                    type="tel"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="w-full">
                        <p>Email</p>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            placeholder="your@email.com"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                            type="email"
                            required
                        />
                    </div>

                    <div className="w-full">
                        <p>Password</p>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="Enter password"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
                            type="password"
                            required
                        />
                    </div>

                    {state === "register" ? (
                        <p className="text-sm">
                            Already have an account?{" "}
                            <span
                                onClick={() => setState("login")}
                                className="text-indigo-500 cursor-pointer font-medium hover:underline"
                            >
                                Login here
                            </span>
                        </p>
                    ) : (
                        <p className="text-sm">
                            Don't have an account?{" "}
                            <span
                                onClick={() => setState("register")}
                                className="text-indigo-500 cursor-pointer font-medium hover:underline"
                            >
                                Register here
                            </span>
                        </p>
                    )}

                    <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                        {state === "register" ? "Create Seller Account" : "Login"}
                    </button>

                    <div className="w-full text-center border-t border-gray-100 pt-3 mt-2">
                        <p className="text-sm text-gray-500">
                            <span onClick={() => navigate("/home")} className="text-indigo-500 cursor-pointer hover:underline">
                                Back to Home
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        )
    );
};

export default SellerLogin;
