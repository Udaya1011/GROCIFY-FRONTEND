import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerProfile = () => {
    const { axios } = useAppContext();
    const [seller, setSeller] = useState(null);
    const [name, setName] = useState("");
    const [shopName, setShopName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get("/api/seller/profile");
            if (data.success) {
                setSeller(data.seller);
                setName(data.seller.name);
                setShopName(data.seller.shopName);
                setPhone(data.seller.phone);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put("/api/seller/profile", {
                name,
                shopName,
                phone,
            });
            if (data.success) {
                toast.success(data.message);
                fetchProfile();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return <div className="p-6">Loading profile...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-semibold">Seller Profile</h2>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                <form onSubmit={updateProfile} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Shop Name
                        </label>
                        <input
                            type="text"
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={seller?.email || ""}
                            disabled
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 text-gray-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm ${seller?.status === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : seller?.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                        >
                            {seller?.status}
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SellerProfile;
