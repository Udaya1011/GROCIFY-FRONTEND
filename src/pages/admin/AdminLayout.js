import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
const AdminLayout = () => {
  const { isAdmin, setIsAdmin, axios, navigate } = useAppContext();
  const sidebarLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: assets.order_icon },
    { name: "Products", path: "/admin/product-list", icon: assets.product_list_icon },
    { name: "Add Product", path: "/admin/add-product", icon: assets.add_icon },
    { name: "Orders", path: "/admin/orders", icon: assets.order_icon },
    { name: "Users", path: "/admin/users", icon: assets.profile_icon },
    { name: "Inventory", path: "/admin/inventory", icon: assets.product_list_icon },
    { name: "Coupons", path: "/admin/coupons", icon: assets.add_icon },
    { name: "Sellers", path: "/admin/sellers", icon: assets.profile_icon },
    { name: "Issues", path: "/admin/issues", icon: assets.refresh_icon },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/admin/logout");
      if (data.success) {
        setIsAdmin(false);
        toast.success("Logged out successfully");
        navigate("/home");
      }
    } catch (error) {
      toast.error("Failed to logout");
      console.error(error);
    }
  };
  return (
    <>
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
        <Link to={"/home"}>
          <h1 className="text-2xl font-semibold">Grocery Store Admin</h1>
        </Link>
        <div className="flex items-center gap-5 text-gray-500">
          <p>Hi! Admin</p>
          <button
            onClick={logout}
            className="border rounded-full text-sm px-4 py-1 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex bg-white">
        <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col bg-white">
          {sidebarLinks.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/admin/dashboard"}
              className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                            ${isActive
                  ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                  : "hover:bg-gray-100/90 border-white "
                }`}
            >
              <img src={item.icon} alt="" className="w-7 h-7" />
              <p className="md:block hidden text-center">{item.name}</p>
            </NavLink>
          ))}
        </div>
        <div className="flex-1 h-[95vh] overflow-y-auto p-4 bg-gray-50">
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default AdminLayout;
