import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import CreateEditForm from "@/components/product/CreateEditForm";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function DashboardNavigation() {
  const {
    isLoggedIn,
    user: { role },
  } = useSelector((state: RootState) => state.user);

  return (
    <div className="mt-24">
      <div className="flex mb-3 flex-col md:flex-row justify-between items-center w-full">
        <h2 className="text-2xl text-center font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Welcome User/Admin{" "}
        </h2>
      </div>
      <div className="flex justify-between flex-col md:flex-row ">
        <div className="flex justify-center md:justify-start gap-3 mb-3 md:w-3/4 w-full">
          {isLoggedIn && role === "admin" && (
            <Link
              className="bg-transparent border px-4 py-2 rounded-lg "
              to="/dashboard"
            >
              Products
            </Link>
          )}
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
        </div>
        {isLoggedIn && role === "admin" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create Product</Button>
            </DialogTrigger>
            <CreateEditForm />
          </Dialog>
        )}
      </div>
    </div>
  );
}
