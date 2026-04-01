import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const { axios, navigate } = useAppContext();
    const [step, setStep] = useState(1); // 1: Mobile, 2: OTP, 3: New Password
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (mobile.length < 10) return toast.error("Please enter a valid mobile number");
        setLoading(true);
        try {
            const { data } = await axios.post("/api/user/forgot-password-otp", { mobile, action: 'send' });
            if (data.success) {
                toast.success(data.message);
                setStep(2);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (otp.length < 6) return toast.error("Please enter a 6-digit OTP");
        setLoading(true);
        try {
            const { data } = await axios.post("/api/user/forgot-password-otp", { mobile, otp, action: 'verify' });
            if (data.success) {
                toast.success(data.message);
                setStep(3);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
        if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
        setLoading(true);
        try {
            const { data } = await axios.post("/api/user/reset-password-otp", { mobile, otp, newPassword });
            if (data.success) {
                toast.success("Password reset successfully.");
                navigate("/login");
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
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {step === 1 ? "Forgot Password" : step === 2 ? "Verify OTP" : "Reset Password"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {step === 1 ? "Enter your registered mobile number." :
                            step === 2 ? "Enter the OTP sent to your mobile." :
                                "Enter your new password below."}
                    </p>
                </div>

                <div className="mt-8">
                    {step === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="tel"
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder=""
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg">
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6 animate-fade-in">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21a9.99 9.99 0 007.443-3.29m-6.433-3.99a8.947 8.947 0 010-4.72m0 0a8.947 8.947 0 010 4.72M13 11l-.853-.853M17 11c0-2.761-2.239-5-5-5s-5 2.239-5 5" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-lg">
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>
                            <p onClick={() => setStep(1)} className="text-center text-sm text-indigo-600 cursor-pointer hover:underline">Change Mobile Number</p>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-6 animate-fade-in">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg">
                                {loading ? "Resetting..." : "Update Password"}
                            </button>
                        </form>
                    )}
                </div>

                <div className="text-center">
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 text-sm">
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
