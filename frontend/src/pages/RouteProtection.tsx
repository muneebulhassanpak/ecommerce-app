import { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const NormalRouteChecker = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export const AdminRouteChecker = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const role = useSelector((state: RootState) => state.user.user.role);

  return role === "admin" ? children : <Navigate to="/login" />;
};

export default NormalRouteChecker;
