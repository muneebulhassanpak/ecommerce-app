import DashboardNavigation from "@/components/Layout/DashboardLayout";
import { Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <DashboardNavigation />
      <Outlet />
    </>
  );
}
