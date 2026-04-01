import { Routes, Route, useLocation } from "react-router-dom";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import Recipes from "./pages/Recipes";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import ProductCategory from "./pages/ProductCategory";
import Address from "./pages/Address";
import MyOrders from "./pages/MyOrders";
import UserDashboard from "./pages/UserDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AddProduct from "./pages/admin/AddProduct";
import ProductList from "./pages/admin/ProductList";
import Orders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminIssues from "./pages/admin/AdminIssues";
import AdminSellers from "./pages/admin/AdminSellers";
import Inventory from "./pages/admin/Inventory";
import Coupons from "./pages/admin/Coupons";
import Verify from "./pages/Verify";
import SellerLogin from "./components/seller/SellerLogin";
import SellerLayout from "./pages/seller/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerOrders from "./pages/seller/SellerOrders";
import SellerProfile from "./pages/seller/SellerProfile";
import BreakfastEssentials from "./pages/BreakfastEssentials";
import NoodlesPasta from "./pages/NoodlesPasta";
import KetchupDipsSpreads from "./pages/KetchupDipsSpreads";
import ChocolateSweets from "./pages/ChocolateSweets";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

import ReadyToCook from "./pages/ReadyToCook";
import BakingEssentials from "./pages/BakingEssentials";
import MasalasSpices from "./pages/MasalasSpices";
import Detergent from "./pages/Detergent";
import HouseholdCare from "./pages/HouseholdCare";
import TeaCoffee from "./pages/TeaCoffee";
import DeliveryLogin from "./pages/delivery/DeliveryLogin";
import DeliveryLayout from "./pages/delivery/DeliveryLayout";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import AssignedOrders from "./pages/delivery/AssignedOrders";
import DeliveryHistory from "./pages/delivery/DeliveryHistory";
import DeliveryProfile from "./pages/delivery/DeliveryProfile";


const App = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.includes("admin");
  const isSellerPath = location.pathname.includes("seller");
  const isDeliveryPath = location.pathname.includes("delivery");
  const isWelcomePath = location.pathname === "/";
  const { showUserLogin, isAdmin, isSeller, deliveryBoy } = useAppContext();
  return (
    <div className="text-default min-h-screen" style={{ backgroundColor: "#eefbf1" }}>
      {isAdminPath || isSellerPath || isDeliveryPath || isWelcomePath ? null : <Navbar />}
      <Toaster />
      <div
        className={`${isAdminPath || isSellerPath || isDeliveryPath || isWelcomePath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}
      >
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/product/:category/:id" element={<SingleProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<Address />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/my-account" element={<UserDashboard />} />
          <Route path="/breakfast-essentials" element={<BreakfastEssentials />} />
          <Route path="/noodles-pasta" element={<NoodlesPasta />} />
          <Route path="/ketchup-dips-spreads" element={<KetchupDipsSpreads />} />
          <Route path="/chocolate-sweets" element={<ChocolateSweets />} />

          <Route path="/ready-to-cook" element={<ReadyToCook />} />
          <Route path="/baking-essentials" element={<BakingEssentials />} />
          <Route path="/masalas-spices" element={<MasalasSpices />} />
          <Route path="/household-care" element={<HouseholdCare />} />
          <Route path="/detergent" element={<Detergent />} />
          <Route path="/tea-coffee" element={<TeaCoffee />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/snacks" element={<ProductCategory categoryOverride="Snacks" />} />
          <Route
            path="/admin"
            element={isAdmin ? <AdminLayout /> : <AdminLogin />}
          >
            <Route index element={isAdmin ? <AdminDashboard /> : null} />
            <Route path="dashboard" element={isAdmin ? <AdminDashboard /> : null} />
            <Route
              path="add-product"
              element={isAdmin ? <AddProduct /> : null}
            />
            <Route
              path="product-list"
              element={isAdmin ? <ProductList /> : null}
            />
            <Route path="orders" element={isAdmin ? <Orders /> : null} />
            <Route path="users" element={isAdmin ? <AdminUsers /> : null} />
            <Route path="sellers" element={isAdmin ? <AdminSellers /> : null} />
            <Route path="issues" element={isAdmin ? <AdminIssues /> : null} />
            <Route path="inventory" element={isAdmin ? <Inventory /> : null} />
            <Route path="coupons" element={isAdmin ? <Coupons /> : null} />
          </Route>
          <Route
            path="/seller"
            element={isSeller ? <SellerLayout /> : <SellerLogin />}
          >
            <Route index element={isSeller ? <SellerDashboard /> : null} />
            <Route path="products" element={isSeller ? <SellerProducts /> : null} />
            <Route path="orders" element={isSeller ? <SellerOrders /> : null} />
            <Route path="profile" element={isSeller ? <SellerProfile /> : null} />
          </Route>
          <Route path="/delivery/login" element={<DeliveryLogin />} />
          <Route
            path="/delivery"
            element={deliveryBoy ? <DeliveryLayout /> : <DeliveryLogin />}
          >
            <Route path="dashboard" element={deliveryBoy ? <DeliveryDashboard /> : null} />
            <Route path="assigned" element={deliveryBoy ? <AssignedOrders /> : null} />
            <Route path="history" element={deliveryBoy ? <DeliveryHistory /> : null} />
            <Route path="profile" element={deliveryBoy ? <DeliveryProfile /> : null} />
          </Route>
        </Routes>
      </div>
      {isAdminPath || isSellerPath || isDeliveryPath || isWelcomePath ? null : <Footer />}
    </div>
  );
};
export default App;
