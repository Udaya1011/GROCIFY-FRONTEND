import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const DeliveryProfile = () => {
    const { deliveryBoy, setDeliveryBoy, axios } = useContext(AppContext);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (deliveryBoy) {
            setName(deliveryBoy.name || "");
            setPhone(deliveryBoy.phone || "");
            setEmail(deliveryBoy.email || "");
        }
    }, [deliveryBoy]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post("/api/delivery/profile", { name, phone });
            if (data.success) {
                toast.success(data.message);
                setDeliveryBoy(data.deliveryBoy);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Agent Profile</h2>
                <p className="text-sm text-gray-500 font-medium">Manage your personal information</p>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleUpdate} className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <input
                                type="tel"
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address (Read-only)</label>
                        <input
                            type="email"
                            disabled
                            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 cursor-not-allowed"
                            value={email}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'}`}
                        >
                            {loading ? "Updating..." : "Save Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DeliveryProfile;
