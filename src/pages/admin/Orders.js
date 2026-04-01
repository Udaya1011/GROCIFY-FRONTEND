import React, { useContext, useEffect, useState } from "react";
import { AppContext, useAppContext } from "../../context/AppContext";
import { assets, dummyOrders } from "../../assets/assets";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const { axios } = useAppContext();

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/admin");
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchDeliveryBoys = async () => {
    try {
      const { data } = await axios.get("/api/admin/delivery/list");
      if (data.success) {
        setDeliveryBoys(data.deliveryBoys);
      }
    } catch (error) {
      console.error("Failed to fetch delivery boys");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryBoys();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Picked Up":
        return "bg-cyan-100 text-cyan-700 border-cyan-200";
      case "On the Way":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Shipped":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "Packed":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const { data } = await axios.post("/api/order/status", {
        orderId,
        status: newStatus,
      });
      if (data.success) {
        toast.success("Status Updated Successfully");
        await fetchOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAssignDelivery = async (orderId, deliveryBoyId) => {
    try {
      const { data } = await axios.post("/api/admin/order/assign", {
        orderId,
        deliveryBoyId,
      });
      if (data.success) {
        toast.success(data.message);
        await fetchOrders();
      }
    } catch (error) {
      toast.error("Assignment failed");
    }
  };

  return (
    <div className="flex-1 py-10">
      <div className="w-full md:p-10 p-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Order Management
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full font-bold shadow-sm border border-gray-200">
            Total {orders.length} Orders
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Order Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Assign Delivery</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded w-fit">
                            #{order._id.slice(-6).toUpperCase()}
                          </span>
                          <div className="mt-2 space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                                <span className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded text-[10px] font-bold">
                                  {item.quantity}
                                </span>
                                <span className="font-medium truncate max-w-[200px]">
                                  {item.product?.name || "Deleted Product"}
                                </span>
                              </div>
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400 mt-2 font-medium">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <p className="text-sm font-bold text-gray-800">
                            {order.address?.firstName} {order.address?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {order.address?.city}, {order.address?.state}
                          </p>
                          <span className="text-[10px] text-indigo-500 font-bold mt-1">
                            {order.paymentType} • {order.isPaid ? "Paid" : "Pending"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 font-black text-gray-900 text-base">
                        ₹{order.amount}
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1.5 rounded-full text-[11px] font-black border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <select
                          value={order.deliveryBoyId?._id || ""}
                          onChange={(e) => handleAssignDelivery(order._id, e.target.value)}
                          className="text-[10px] font-black bg-indigo-50 border-none text-indigo-600 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-indigo-400 outline-none cursor-pointer uppercase tracking-widest"
                        >
                          <option value="">Choose Agent</option>
                          {deliveryBoys.map((boy) => (
                            <option key={boy._id} value={boy._id}>
                              {boy.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="text-xs font-bold bg-white border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none shadow-sm cursor-pointer hover:border-gray-300 transition-all"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Order Confirmed">Order Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Picked Up">Picked Up</option>
                          <option value="On the Way">On the Way</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-400 font-medium text-sm">No orders found in the system</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
