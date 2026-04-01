import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import LocationMapPicker from "../components/LocationMapPicker";

const Address = () => {
  const [activeTab, setActiveTab] = useState("manual"); // 'manual' | 'map'
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    landmark: "",
    phone: "",
    lat: null,
    lng: null,
  });

  const { axios, user, navigate } = useContext(AppContext);

  // Pre-fill user data if available to save the user time
  useEffect(() => {
    if (user) {
      setAddress(prev => ({
        ...prev,
        firstName: user.name?.split(' ')[0] || "",
        lastName: user.name?.split(' ')[1] || "",
        email: user.email || "",
        phone: user.mobile || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleMapSelect = (mapData) => {
    // Auto-fill fields based on reverse geocoding
    setAddress(prev => ({
      ...prev,
      street: mapData.street || prev.street,
      city: mapData.city || prev.city,
      state: mapData.state || prev.state,
      landmark: mapData.landmark || prev.landmark,
      lat: mapData.lat,
      lng: mapData.lng
    }));
    // Optional: switch back to manual tab so they can review/edit the auto-filled address
    toast.success("Address auto-filled from map!");
    setActiveTab("manual");
  };

  const submitHanlder = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post("/api/address/add", { address });
      console.log("data", data);
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="mt-8 mb-20 max-w-6xl mx-auto flex flex-col md:flex-row gap-8 bg-transparent">

      {/* Left Side: Toggles & Forms */}
      <div className="flex-1 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col">

        <div className="mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-2">
            Delivery Address
          </h2>
          <p className="text-sm text-gray-500 font-medium">Choose how you want to enter your drop-off location</p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex p-1 bg-gray-50/80 rounded-2xl border border-gray-200/60 mb-8 relative w-full overflow-hidden">
          <div
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 ease-out flex items-center justify-center p-3 z-0 ${activeTab === 'map' ? 'translate-x-[calc(100%+4px)]' : 'translate-x-1'}`}
          ></div>
          <button
            type="button"
            onClick={() => setActiveTab("manual")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors z-10 w-1/2 ${activeTab === 'manual' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Enter Manually
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("map")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors z-10 w-1/2 ${activeTab === 'map' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Pin on Map
          </button>
        </div>

        {/* Map Picker View */}
        {activeTab === 'map' && (
          <div className="flex-1 min-h-[400px] flex flex-col space-y-4 animate-fade-in">
            <p className="text-sm text-gray-500 bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Drag the map marker to your exact location. The address details will be automatically extracted and filled in for you.
            </p>
            <div className="flex-1 rounded-2xl overflow-hidden shadow-inner border border-gray-200">
              <LocationMapPicker onAddressSelect={handleMapSelect} />
            </div>
          </div>
        )}

        {/* Manual Input Form */}
        <form
          onSubmit={submitHanlder}
          className={`${activeTab === 'manual' ? 'grid' : 'hidden'} grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 animate-fade-in`}
        >
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={address.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400"
              placeholder="John"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={address.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400"
              placeholder="Doe"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={address.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400"
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={address.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400 disabled:opacity-50"
              placeholder="john@example.com"
              disabled // Usually email is tied to auth, so prevent changes if prefilled
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Delivery Coordinates</h3>
            {address.lat && address.lng ? (
              <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pinned
              </span>
            ) : (
              <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                Unpinned
              </span>
            )}
          </div>

          {/* Visual Coordinate Readout */}
          {address.lat && address.lng && (
            <div className="col-span-1 md:col-span-2 bg-gray-50 text-xs font-mono text-gray-500 p-2 rounded-lg border border-gray-100 flex gap-4">
              <span>Lat: {address.lat.toFixed(6)}</span>
              <span>Lng: {address.lng.toFixed(6)}</span>
            </div>
          )}

          <div className="col-span-1 md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
              <span>Street Address</span>
              {!address.lat && <span className="text-orange-400 lowercase normal-case italic">Missing Map Pin</span>}
            </label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400"
              placeholder="123 Main St, Apartment 4B"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400"
              placeholder="Mumbai"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State / Region</label>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400"
              placeholder="Maharashtra"
              required
            />
          </div>

          <div className="col-span-1 md:col-span-2 space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Landmark (Optional)</label>
            <input
              type="text"
              name="landmark"
              value={address.landmark}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl text-sm font-bold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-400"
              placeholder="Near Apollo Hospital"
            />
          </div>

          <div className="col-span-1 md:col-span-2 mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:-translate-y-0.5 transition-all"
            >
              Save Address & Continue
            </button>
          </div>
        </form>
      </div>

      {/* Right Side: Visual Context */}
      <div className="hidden lg:flex w-[400px] flex-col gap-6 sticky top-24 self-start">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-500/10 overflow-hidden relative">
          <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
            <svg className="w-64 h-64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-sm mb-6">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">Fast & Accurate</h3>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed">
              Pinpointing your exact location on the map ensures our delivery agents reach you without delays or confusion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;

