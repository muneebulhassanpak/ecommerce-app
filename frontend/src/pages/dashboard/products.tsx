import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";
import { useDeleteProduct, useProducts } from "@/apiInteraction";
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
import { ProductFilters } from "@/types/DataTypes";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const ActionCell = ({ row }) => {
  const { toast } = useToast();
  const deleteProduct = useDeleteProduct();

  const handleDelete = (productId: string) => {
    deleteProduct.mutate(productId, {
      onSuccess: () => {
        toast({
          title: "Product Deleted",
          description: "The product has been successfully deleted.",
          variant: "default",
        });
      },
      onError: (error) => {
        toast({
          title: "Error deleting product",
          description:
            error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex justify-start gap-2">
      <Trash
        className="w-5 h-5 cursor-pointer"
        onClick={() => handleDelete(row.original._id)}
      />
      <Pencil className="w-5 h-5 cursor-pointer" />
    </div>
  );
};

export default function Products() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    pageSize: 10,
    minPrice: undefined,
    maxPrice: undefined,
    rating: undefined,
  });

  const { data, isLoading, error } = useProducts(filters);
  const role = useSelector((state: RootState) => state.user.user.role);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: () => <div className="hidden md:table-cell">Description</div>,
      cell: ({ row }) => (
        <div className="hidden md:block">{row.getValue("description")}</div>
      ),
    },
    {
      accessorKey: "price",
      header: () => <div className="text-right">Price</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => <div>{row.getValue("stock")}</div>,
    },
    ...(role === "admin"
      ? [
          {
            id: "actions",
            header: "Actions",
            cell: ActionCell,
          },
        ]
      : []),
  ];

  const tableData = data?.data || [];
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
