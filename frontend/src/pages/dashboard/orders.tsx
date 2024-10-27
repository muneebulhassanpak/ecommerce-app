import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { useUpdateOrderStatus, useViewOrders } from "@/apiInteraction";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import Spinner from "@/components/shared/Loader";
import CustomPagination from "@/components/product/CustomPagination";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ActionCell = ({ row, isAdmin }: { row: any; isAdmin: boolean }) => {
  const { toast } = useToast();
  const updateOrderStatus = useUpdateOrderStatus();

  if (!isAdmin) {
    // If the user is not an admin, display the order status
    return (
      <p
        className={`px-2 py-1 max-w-[80px] text-center rounded-md ${
          row.original.status === "in-process"
            ? "bg-green-100"
            : row.original.status === "declined"
            ? "bg-red-100"
            : "bg-gray-100"
        }`}
      >
        {row.original.status}
      </p>
    );
  }

  const handleApprove = () => {
    updateOrderStatus.mutate(
      { orderId: row.original._id, status: "in-process" },
      {
        onSuccess: () => {
          toast({
            title: "Order Approved",
            description: "The order has been approved successfully.",
            variant: "default",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to approve the order.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleReject = () => {
    updateOrderStatus.mutate(
      { orderId: row.original._id, status: "declined" },
      {
        onSuccess: () => {
          toast({
            title: "Order Rejected",
            description: "The order has been rejected.",
            variant: "destructive",
          });
        },
        onError: (error) => {
          toast({
            title: "Error",
            description: error.message || "Failed to reject the order.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <div className="flex justify-start gap-2">
      {row.original.status === "pending" ? (
        <>
          <button
            onClick={handleApprove}
            className="bg-green-500 text-white p-2 rounded"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 text-white p-2 rounded"
          >
            Reject
          </button>
        </>
      ) : (
        <p
          className={`px-2 py-1 max-w-[80px] rounded-md ${
            row.original.status === "in-process" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {row.original.status}
        </p>
      )}
    </div>
  );
};

export default function Orders() {
  const role = useSelector((state: RootState) => state.user.user.role);
  const isAdmin = role === "admin";
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    role: role ?? "user",
  });

  const { data, isLoading, error } = useViewOrders(filters);

  const tableData =
    data?.data.map((order) => ({
      _id: order._id,
      user: order.user,
      totalAmount: order.totalAmount,
      status: order.status,
    })) || [];

  // Define columns conditionally based on role
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "user.name",
      header: "User Name",
      cell: ({ row }) => <div>{row.original.user.name}</div>,
    },
    {
      accessorKey: "totalAmount",
      header: "Total Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalAmount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: isAdmin ? "Actions" : "Status",
      cell: ({ row }) => <ActionCell row={row} isAdmin={isAdmin} />,
    },
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="w-[95%] md:w-full overflow-x-auto">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {tableData.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {data?.pagination && (
          <CustomPagination
            currentPage={data.pagination.currentPage}
            pageSize={data.pagination.pageSize}
            totalPages={data.pagination.totalPages}
            totalEntries={data.pagination.totalEntries}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            onPageSizeChange={(pageSize) =>
              setFilters((prev) => ({ ...prev, page: 1, pageSize }))
            }
          />
        )}
      </div>
    </div>
  );
}
