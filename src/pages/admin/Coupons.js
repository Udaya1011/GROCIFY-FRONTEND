import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Coupons = () => {
    const { axios } = useAppContext();
    const [coupons, setCoupons] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        minAmount: "",
        expiryDate: ""
    });

    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get("/api/coupon/all");
            if (data.success) setCoupons(data.coupons);
        } catch (error) {
            toast.error("Failed to fetch coupons");
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post("/api/coupon/create", formData);
            if (data.success) {
                toast.success(data.message);
                setShowModal(false);
                fetchCoupons();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const deleteCoupon = async (id) => {
        if (!window.confirm("Delete this coupon?")) return;
        try {
            const { data } = await axios.post("/api/coupon/delete", { id });
            if (data.success) {
                toast.success(data.message);
                fetchCoupons();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold">Coupon Management</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    Create New Coupon
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons.map((coupon) => (
                    <div key={coupon._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xl font-bold text-indigo-600 uppercase tracking-wider">{coupon.code}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {coupon.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{coupon.description}</p>
                            <div className="space-y-2 text-sm text-gray-500">
                                <p>Discount: <span className="text-gray-900 font-medium">{coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ' Fixed'}</span></p>
                                <p>Min Order: <span className="text-gray-900 font-medium">₹{coupon.minAmount}</span></p>
                                <p>Expires: <span className="text-gray-900 font-medium">{new Date(coupon.expiryDate).toLocaleDateString()}</span></p>
                            </div>
                        </div>
                        <button
                            onClick={() => deleteCoupon(coupon._id)}
                            className="mt-6 text-red-500 hover:text-red-700 text-sm font-medium w-fit"
                        >
                            Delete Coupon
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl">
                        <h3 className="text-xl font-bold mb-6">Create Promotional Coupon</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
                                    <input required type="text" className="mt-1 block w-full px-4 py-2 border rounded-lg" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                    <input required type="date" className="mt-1 block w-full px-4 py-2 border rounded-lg" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input required type="text" className="mt-1 block w-full px-4 py-2 border rounded-lg" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type</label>
                                    <select className="mt-1 block w-full px-4 py-2 border rounded-lg" value={formData.discountType} onChange={e => setFormData({ ...formData, discountType: e.target.value })}>
                                        <option value="percentage">Percent %</option>
                                        <option value="fixed">Fixed ₹</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Value</label>
                                    <input required type="number" className="mt-1 block w-full px-4 py-2 border rounded-lg" value={formData.discountValue} onChange={e => setFormData({ ...formData, discountValue: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Min Order</label>
                                    <input required type="number" className="mt-1 block w-full px-4 py-2 border rounded-lg" value={formData.minAmount} onChange={e => setFormData({ ...formData, minAmount: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-500 font-medium">Cancel</button>
                                <button type="submit" className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">Save Coupon</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
