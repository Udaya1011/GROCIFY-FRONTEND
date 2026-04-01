import { useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { axios, navigate, setCartItems } = useContext(AppContext);

    const verifyPayment = async () => {
        try {
            const { data } = await axios.post("/api/order/verifyStripe", {
                success,
                orderId,
            });
            if (data.success) {
                setCartItems({});
                toast.success(data.message);
                navigate("/my-orders");
            } else {
                toast.error(data.message);
                navigate("/cart");
            }
        } catch (error) {
            toast.error(error.message);
            navigate("/cart");
        }
    };

    useEffect(() => {
        if (orderId && success !== null) {
            verifyPayment();
        }
    }, [orderId, success]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-20 h-20 border-4 border-gray-300 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
    );
};

export default Verify;
