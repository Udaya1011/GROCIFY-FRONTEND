import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useEffect, useState } from "react";

const Welcome = () => {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
      style={{
        background:
          "linear-gradient(160deg, #f7fef9 0%, #eefef4 25%, #d9f9e5 50%, #b1f6cb 75%, #76e9a1 100%)",
      }}
    >
      {/* Decorative top-right blob */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, #4ade80 0%, transparent 70%)",
        }}
      />
      {/* Decorative bottom-left blob */}
      <div
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, #22c55e 0%, transparent 70%)",
        }}
      />

      {/* Dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #166534 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Floating leaf/grocery decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute transition-all duration-1000 ${loaded ? "opacity-30 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ top: "8%", left: "6%" }}
        >
          <img
            src={assets.leaf_icon}
            alt=""
            className="w-14 h-14 animate-bounce-gentle"
          />
        </div>
        <div
          className={`absolute transition-all duration-1000 delay-200 ${loaded ? "opacity-25 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ top: "18%", right: "8%" }}
        >
          <img
            src={assets.delivery_truck_icon}
            alt=""
            className="w-16 h-16 animate-bounce-gentle-delayed"
          />
        </div>
        <div
          className={`absolute transition-all duration-1000 delay-400 ${loaded ? "opacity-20 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ bottom: "20%", left: "8%" }}
        >
          <img
            src={assets.coin_icon}
            alt=""
            className="w-12 h-12 animate-bounce-gentle"
          />
        </div>
        <div
          className={`absolute transition-all duration-1000 delay-600 ${loaded ? "opacity-25 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ bottom: "15%", right: "10%" }}
        >
          <img
            src={assets.box_icon}
            alt=""
            className="w-14 h-14 animate-bounce-gentle-delayed"
          />
        </div>
        <div
          className={`absolute transition-all duration-1000 delay-300 ${loaded ? "opacity-20 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ top: "45%", left: "4%" }}
        >
          <img
            src={assets.trust_icon}
            alt=""
            className="w-11 h-11 animate-bounce-gentle"
          />
        </div>
        <div
          className={`absolute hidden md:block transition-all duration-1000 delay-500 ${loaded ? "opacity-15 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ top: "55%", right: "5%" }}
        >
          <img
            src={assets.leaf_icon}
            alt=""
            className="w-10 h-10 animate-bounce-gentle-delayed"
          />
        </div>
      </div>

      {/* Main Content Card */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-6 py-12 md:py-16 max-w-2xl transition-all duration-1000 ease-out ${loaded ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}
      >
        {/* Logo Circle */}
        <div
          className={`mb-8 transition-all duration-700 delay-200 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        >
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white shadow-xl shadow-green-200/60 flex items-center justify-center border-4 border-green-100 mx-auto relative">
            {/* Pulsing ring */}
            <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping-slow opacity-30" />
            <img
              src={assets.cart_icon}
              alt="Grocify"
              className="w-14 h-14 md:w-16 md:h-16"
            />
          </div>
        </div>

        {/* Welcome Text */}
        <div
          className={`transition-all duration-700 delay-400 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-green-700/70 text-sm md:text-base tracking-[0.25em] uppercase font-semibold mb-3">
            Welcome to
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-green-900 mb-5 tracking-tight leading-none">
            Grocify
          </h1>
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-12 h-[3px] bg-green-400 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div className="w-12 h-[3px] bg-green-400 rounded-full" />
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl text-green-800/80 font-medium tracking-wide">
            Smart Grocery Shopping
          </p>
        </div>

        {/* Tagline */}
        <p
          className={`text-green-700/60 text-sm md:text-base mt-5 max-w-md leading-relaxed transition-all duration-700 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          Fresh produce, daily essentials & more — delivered right to your
          doorstep with love. 🥬🍎🥛
        </p>

        {/* CTA Button */}
        <div
          className={`mt-10 transition-all duration-700 delay-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <button
            onClick={() => navigate("/home")}
            className="group relative cursor-pointer px-10 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-full shadow-xl shadow-green-500/30 hover:shadow-green-600/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            <span className="relative flex items-center gap-3">
              {/* Shopping bag icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              Fill Your Basket
              {/* Arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
          </button>
        </div>

        {/* Feature Badges */}
        <div
          className={`mt-14 flex flex-wrap justify-center gap-6 md:gap-10 transition-all duration-700 delay-900 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {[
            { icon: assets.delivery_truck_icon, text: "Fast Delivery" },
            { icon: assets.leaf_icon, text: "100% Fresh" },
            { icon: assets.coin_icon, text: "Best Prices" },
            { icon: assets.trust_icon, text: "Trusted Quality" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 group cursor-default"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md shadow-green-200/40 border border-green-100 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                <img
                  src={item.icon}
                  alt={item.text}
                  className="w-7 h-7"
                />
              </div>
              <span className="text-green-800/60 text-xs font-semibold tracking-wider uppercase">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes bounce-gentle-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.3; }
          75%, 100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-bounce-gentle { animation: bounce-gentle 3.5s ease-in-out infinite; }
        .animate-bounce-gentle-delayed { animation: bounce-gentle-delayed 4s ease-in-out infinite; }
        .animate-ping-slow { animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};

export default Welcome;
