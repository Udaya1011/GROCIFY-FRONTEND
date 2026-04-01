import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminSellers = () => {
    const { axios } = useAppContext();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // all, pending, approved, blocked

    const fetchSellers = async () => {
        try {
            const { data } = await axios.get("/api/admin/sellers");
            if (data.success) {
                setSellers(data.sellers);
            }
        } catch (error) {
            console.error("Error fetching sellers:", error);
            toast.error("Failed to load sellers");
        } finally {
            setLoading(false);
        }
    };

    const approveSeller = async (id) => {
        try {
            const { data } = await axios.put(`/api/admin/sellers/${id}/approve`);
            if (data.success) {
                toast.success(data.message);
                fetchSellers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error approving seller:", error);
            toast.error("Failed to approve seller");
        }
    };

    const blockSeller = async (id) => {
        if (!confirm("Are you sure you want to block this seller?")) return;

        try {
            const { data } = await axios.put(`/api/admin/sellers/${id}/block`);
            if (data.success) {
                toast.success(data.message);
                fetchSellers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error blocking seller:", error);
            toast.error("Failed to block seller");
        }
    };

    useEffect(() => {
        fetchSellers();
    }, []);

    const filteredSellers = sellers.filter((seller) => {
        if (filter === "all") return true;
        return seller.status === filter;
    });

    if (loading) {
        return <div className="p-6">Loading sellers...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Manage Sellers</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg ${filter === "all" ? "bg-indigo-500 text-white" : "bg-gray-200"
                            }`}
                    >
                        All ({sellers.length})
                    </button>
                    <button
                        onClick={() => setFilter("pending")}
                        className={`px-4 py-2 rounded-lg ${filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-200"
                            }`}
                    >
                        Pending ({sellers.filter((s) => s.status === "pending").length})
                    </button>
                    <button
                        onClick={() => setFilter("approved")}
                        className={`px-4 py-2 rounded-lg ${filter === "approved" ? "bg-green-500 text-white" : "bg-gray-200"
                            }`}
                    >
                        Approved ({sellers.filter((s) => s.status === "approved").length})
                    </button>
                    <button
                        onClick={() => setFilter("blocked")}
                        className={`px-4 py-2 rounded-lg ${filter === "blocked" ? "bg-red-500 text-white" : "bg-gray-200"
                            }`}
                    >
                        Blocked ({sellers.filter((s) => s.status === "blocked").length})
                    </button>
                </div>
            </div>

            {filteredSellers.length === 0 ? (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500">No sellers found</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Shop Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Email</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Registered</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSellers.map((seller) => (
                                    <tr key={seller._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4 text-sm">{seller.name}</td>
                                        <td className="py-3 px-4 text-sm font-medium">{seller.shopName}</td>
                                        <td className="py-3 px-4 text-sm">{seller.email}</td>
                                        <td className="py-3 px-4 text-sm">{seller.phone}</td>
                                        <td className="py-3 px-4 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs ${seller.status === "approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : seller.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {seller.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-500">
                                            {new Date(seller.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 text-sm">
                                            <div className="flex gap-2">
                                                {seller.status === "pending" && (
                                                    <button
                                                        onClick={() => approveSeller(seller._id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {seller.status !== "blocked" && (
                                                    <button
                                                        onClick={() => blockSeller(seller._id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                                    >
                                                        Block
                                                    </button>
                                                )}
                                                {seller.status === "blocked" && (
                                                    <button
                                                        onClick={() => approveSeller(seller._id)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                                    >
                                                        Unblock
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSellers;
