import { Routes, Route } from "react-router-dom";

import Auth from "@/pages/auth";
import PageNotFound from "@/pages/page-not-found";
import Header from "@/components/Layout/Header";
import Shop from "@/pages/Shop";
import Home from "@/pages/Home";
import Profile from "@/pages/dashboard/profile";
import Dashboard from "@/pages/dashboard/dashboard";
import Orders from "./pages/dashboard/orders";
import Products from "./pages/dashboard/products";

const App = () => {
  return (
    <>
      <Header />
      <div className="h-full w-full min-h-screen grid place-items-center">
        <div className="max-w-7xl mx-auto w-[95%] md:w-full p-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="/shop" element={<Shop />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default App;
