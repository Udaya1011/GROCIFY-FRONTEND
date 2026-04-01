import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Login = () => {
    const { setUser, axios, navigate } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Advanced Login State
    const [loginMethod, setLoginMethod] = useState("email"); // 'email' or 'otp'
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post("/api/user/login", {
                email,
                password,
            });

            if (data.success) {
                toast.success(data.message);
                setUser(data.user);
                await useAppContext().fetchUser();
                navigate("/home");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async () => {
        if (mobile.length < 10) {
            return toast.error("Please enter a valid mobile number");
        }
        setLoading(true);
        try {
            // Mock API call to send OTP
            const { data } = await axios.post("/api/user/otp-login", { mobile, action: 'send' });
            if (data.success) {
                toast.success(data.message);
                setOtpSent(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length < 6) {
            return toast.error("Please enter a valid 6-digit OTP");
        }
        setLoading(true);
        try {
            // Mock API call to verify OTP
            const { data } = await axios.post("/api/user/otp-login", { mobile, otp, action: 'verify' });
            if (data.success) {
                toast.success(data.message);
                setUser(data.user);
                await useAppContext().fetchUser();
                navigate("/home");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        toast.success("Redirecting to Google Authentication...");
        // Demo redirect logic
        setTimeout(() => {
            // simulate successful login
            // setUser({ name: 'Google User', email: 'user@google.com' });
            // navigate('/');
        }, 1500);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl border border-gray-100">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {loginMethod === 'otp' ? "Login with OTP" : "Sign in to your account"}
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{" "}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            create a new account
                        </Link>
                    </p>
                </div>

                {loginMethod === 'email' ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div className="relative mb-4">
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </span>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder=""
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder=""
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" size="sm" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none transition-all shadow-lg hover:shadow-xl"
                        >
                            Sign in
                        </button>

                        <div className="pt-4 mt-4 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-500 mb-2">Are you an administrator?</p>
                            <Link to="/admin-login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                                Go to Admin Portal
                            </Link>
                        </div>
                    </form>
                ) : (
                    <div className="mt-8 space-y-6">
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
                                    className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter 10 digit mobile"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    disabled={otpSent}
                                />
                            </div>
                        </div>

                        {otpSent && (
                            <div className="relative animate-fade-in">
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
                                        className="appearance-none rounded-lg relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {!otpSent ? (
                            <button
                                onClick={handleSendOTP}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg"
                            >
                                Send OTP
                            </button>
                        ) : (
                            <button
                                onClick={handleVerifyOTP}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 shadow-lg"
                            >
                                Verify & Login
                            </button>
                        )}

                        <button
                            onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
                            className="w-full text-center text-sm text-indigo-600 hover:underline"
                        >
                            Back to Email Login
                        </button>

                        <div className="pt-4 mt-4 border-t border-gray-100 text-center">
                            <p className="text-xs text-gray-500 mb-2">Are you an administrator?</p>
                            <Link to="/admin-login" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                                Go to Admin Portal
                            </Link>
                        </div>
                    </div>
                )}

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm uppercase">
                            <span className="px-4 bg-white text-gray-500 font-semibold tracking-wider">OR</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3">
                        <button
                            onClick={handleGoogleLogin}
                            className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all w-full"
                        >
                            <img
                                className="h-5 w-5 mr-3"
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="Google"
                            />
                            Continue with Google
                        </button>

                        <button
                            onClick={() => setLoginMethod('otp')}
                            className={`flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all w-full ${loginMethod === 'otp' ? 'hidden' : ''}`}
                        >
                            <svg className="h-5 w-5 mr-3 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Login with Mobile OTP
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
