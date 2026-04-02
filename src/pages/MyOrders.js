import { useContext, useEffect, useState } from "react";
import { dummyOrders, assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import DeliveryRatingModal from "../components/DeliveryRatingModal";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user } = useContext(AppContext);
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);
  const [ratingOrderId, setRatingOrderId] = useState(null);

  return (
    <div className="mt-12 pb-16">
      <div>
        <p className="text-2xl md:text-3xl font-medium">My Orders</p>
      </div>

      {myOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 border border-gray-200 rounded-xl mt-8">
          <p className="text-gray-500 mb-4">No orders found. Want to try the rating feature?</p>
          <button
            onClick={async () => {
              try {
                const { data } = await axios.post("/api/order/seed");
                if (data.success) {
                  toast.success("Demo order created!");
                  fetchOrders();
                } else {
                  toast.error(data.message);
                }
              } catch (e) {
                toast.error("Failed to create demo order");
              }
            }}
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Generate Demo Order
          </button>
        </div>
      ) : (
        myOrders.map((order, index) => (
          <div
            key={index}
            className="my-8 border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
          >
            <div className="flex justify-between items-center gap-6 border-b pb-2 mb-2">
              <p className="text-gray-600 text-sm md:text-base">
                <span className="font-semibold">Order ID:</span> {order._id}
              </p>
              {/* Show Rate button if order is Paid/Delivered and not yet rated (checked via order.deliveryRating.isRated) */}
              {order.deliveryRating && order.deliveryRating.isRated ? (
                <span className="text-green-600 font-medium text-sm">✓ Rated</span>
              ) : (
                <button
                  onClick={() => setRatingOrderId(order._id)}
                  className="text-sm border border-indigo-500 text-indigo-500 px-3 py-1 rounded hover:bg-indigo-50 transition"
                >
                  Rate Delivery
                </button>
              )}
            </div>
            <p className="flex justify-between items-center gap-6 mb-2 text-sm text-gray-500">
              <span>Payment: {order.paymentType}</span>
              <span>Total: ₹{order.amount}</span>
            </p>

            {/* Order Status Tracker */}
            <div className="mb-8 px-4 md:px-0">
              <div className="flex items-center justify-between relative">
                {/* Progress Bar Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                <div
                  className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 transform -translate-y-1/2 transition-all duration-500"
                  style={{ width: `${(Math.max(0, ["Order Placed", "Order Confirmed", "Packed", "Picked Up", "On the Way", "Delivered"].indexOf(order.status)) / 5) * 100}%` }}
                ></div>

                {/* Steps */}
                {["Order Placed", "Order Confirmed", "Packed", "Picked Up", "On the Way", "Delivered"].map((status, index) => {
                  const statusList = ["Order Placed", "Order Confirmed", "Packed", "Picked Up", "On the Way", "Delivered"];
                  const currentStatusIndex = statusList.indexOf(order.status);
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;

                  // Label mapping for better UX
                  const labelMap = {
                    "Order Placed": "Placed",
                    "Order Confirmed": "Confirmed",
                    "Packed": "Packed",
                    "Picked Up": "Picked Up",
                    "On the Way": "Walking",
                    "Delivered": "Delivered"
                  };

                  return (
                    <div key={status} className="flex flex-col items-center bg-white px-1">
                      <div className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300
                          ${isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 text-gray-400"}
                          ${isCurrent ? "ring-4 ring-green-100 scale-110" : ""}
                        `}>
                        {isCompleted ? (
                          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        ) : (
                          <span className="text-[10px] md:text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <p className={`mt-2 text-[8px] md:text-[10px] font-bold uppercase tracking-tighter ${isCompleted ? "text-gray-800" : "text-gray-400"}`}>
                        {labelMap[status]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.items?.map((item, index) => (
              <div
                key={index}
                className={`relative bg-white text-gray-800/70 ${order.items.length !== index + 1 && "border-b"
                  } border-gray-300 flex flex-col md:flex-row md:items-center  justify-between p-4 py-5 w-full max-w-4xl`}
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="p-4 rounded-lg">
                    <img
                      src={item.product?.image ? `${import.meta.env.VITE_BACKEND_URL || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://grocify-backend-1.onrender.com')}/images/${item.product.image[0]}` : assets.box_icon}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>

                  <div className="ml-4">
                    <h2 className="text-xl font-medium text-gray-800">{item.product?.name || "Product Unavailable"}</h2>
                    <p className="text-sm text-gray-500">{item.product?.category || "N/A"}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-medium text-gray-600">Quantity: <span className="text-gray-800">{item.quantity || "1"}</span></p>
                  <p className="mt-1 font-medium text-gray-600">
                    Amount: <span className="text-gray-800">₹{(item.product?.offerPrice || 0) * item.quantity}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )))}

      {ratingOrderId && (
        <DeliveryRatingModal
          orderId={ratingOrderId}
          onClose={() => setRatingOrderId(null)}
          onRatingSubmit={fetchOrders}
        />
      )}
    </div>
  );
};
export default MyOrders;
