import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SavedAddresses = () => {
    const { axios, navigate } = useAppContext();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAddresses = async () => {
        try {
            const { data } = await axios.get("/api/address/get");
            if (data.success) {
                setAddresses(data.addresses);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    if (loading) {
        return <div className="py-12 text-center text-gray-500">Loading addresses...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
                <button
                    onClick={() => navigate("/add-address")}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add New Address
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500">No saved addresses found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div key={addr._id} className="p-5 border border-gray-100 rounded-xl hover:shadow-md transition-shadow relative group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded tracking-wider italic">
                                    Address
                                </span>
                            </div>
                            <p className="font-bold text-gray-800">{addr.firstName} {addr.lastName}</p>
                            <p className="text-gray-600 text-sm mt-1">{addr.street}, {addr.landmark}</p>
                            <p className="text-gray-600 text-sm">{addr.city}, {addr.state}</p>
                            <p className="text-gray-600 text-sm mt-2 font-medium">Phone: {addr.phone}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedAddresses;
