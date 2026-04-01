import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import axios from 'axios';

const DeliveryRatingModal = ({ orderId, onClose, onRatingSubmit }) => {
    const [speed, setSpeed] = useState(0);
    const [behavior, setBehavior] = useState(0);
    const [comment, setComment] = useState("");
    const { user } = useAppContext();

    const handleSubmit = async () => {
        if (speed === 0 || behavior === 0) {
            toast.error("Please provide ratings for both Speed and Behavior.");
            return;
        }

        try {
            const { data } = await axios.post('/api/order/rate', {
                orderId,
                speed,
                behavior,
                comment,
            });

            if (data.success) {
                toast.success("Thank you for your feedback!");
                onRatingSubmit(); // Refresh orders or update local state
                onClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error submitting rating:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const renderStars = (rating, setRating) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-fade-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Rate Delivery Partner</h2>

                <div className="space-y-6">
                    {/* Delivery Speed */}
                    <div className="flex flex-col items-center">
                        <label className="text-sm font-medium text-gray-600 mb-2">Delivery Speed</label>
                        {renderStars(speed, setSpeed)}
                        <p className="text-xs text-gray-400 mt-1">
                            {speed === 1 ? "Very Slow" : speed === 5 ? "Super Fast! ⚡" : ""}
                        </p>
                    </div>

                    {/* Behavior */}
                    <div className="flex flex-col items-center">
                        <label className="text-sm font-medium text-gray-600 mb-2">Delivery Person Behavior</label>
                        {renderStars(behavior, setBehavior)}
                        <p className="text-xs text-gray-400 mt-1">
                            {behavior === 1 ? "Rude" : behavior === 5 ? "Very Polite 😊" : ""}
                        </p>
                    </div>

                    {/* Comment */}
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                        rows="3"
                        placeholder="Any additional feedback? (Optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                    <button
                        onClick={handleSubmit}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition active:scale-95"
                    >
                        Submit Feedback
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeliveryRatingModal;
