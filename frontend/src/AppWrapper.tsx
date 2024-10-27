import { Routes, Route } from "react-router-dom";
import Auth from "@/pages/auth";
import PageNotFound from "@/pages/page-not-found";
import Header from "@/components/Layout/Header";
import Shop from "@/pages/shop";
import Home from "@/pages/home";
import Profile from "@/pages/dashboard/profile";
import Dashboard from "@/pages/dashboard/dashboard";
import Orders from "@/pages/dashboard/orders";
import Products from "@/pages/dashboard/products";
import Cart from "@/pages/cart";
import { Toaster } from "@/components/ui/toaster";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { updateUser } from "@/store/userSlice";
import { RootState } from "./store/store";
import { useUserProfile } from "@/apiInteraction";
import NormalRouteChecker, { AdminRouteChecker } from "@/pages/RouteProtection";

const AppWrapper = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const accessToken = Cookies.get("access_token");

  const { data: userProfileResponse } = useUserProfile();

  useEffect(() => {
    if (accessToken && !isLoggedIn && userProfileResponse) {
      dispatch(updateUser(userProfileResponse.data));
    }
  }, [userProfileResponse, dispatch, isLoggedIn, accessToken]);

  return (
    <>
      <Header />
      <div className="h-full w-full min-h-screen grid place-items-center">
        <div className="max-w-7xl mx-auto w-[95%] md:w-full p-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route
              path="/cart"
              element={
                <NormalRouteChecker>
                  <Cart />
                </NormalRouteChecker>
              }
            />

            <Route
              path="/dashboard"
              element={
                <NormalRouteChecker>
                  <Dashboard />
                </NormalRouteChecker>
              }
            >
              <Route
                index
                element={
                  <AdminRouteChecker>
                    <Products />
                  </AdminRouteChecker>
                }
              />
              <Route path="orders" element={<Orders />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default AppWrapper;
