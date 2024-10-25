import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function DashboardNavigation() {
  return (
    <div className="mt-24">
      <div className="flex mb-3 flex-col md:flex-row justify-between items-center w-full">
        <h2 className="text-2xl text-center font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Welcome User/Admin{" "}
        </h2>
      </div>
      <div className="flex justify-between ">
        <div className="flex justify-start gap-3 mb-3">
          <Link
            className="bg-transparent border px-4 py-2 rounded-lg "
            to="/dashboard"
          >
            Products
          </Link>
          <Link
            className="bg-transparent border px-4 py-2 rounded-lg "
            to="/dashboard/orders"
          >
            Orders
          </Link>
          <Link
            className="bg-transparent border px-4 py-2 rounded-lg "
            to="/dashboard/profile"
          >
            Profile
          </Link>
        </div>{" "}
        <Button>Create Product</Button>
      </div>
    </div>
  );
}
