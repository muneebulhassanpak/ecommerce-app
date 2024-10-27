import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useViewCart, useCreateOrder } from "@/apiInteraction"; // Import useCreateOrder
import Spinner from "@/components/shared/Loader";
import { CartItem } from "@/types/DataTypes";
import { useToast } from "@/hooks/use-toast";

const columns: ColumnDef<CartItem, any>[] = [
  {
    accessorKey: "product.name",
    header: "Product Name",
    cell: ({ row }) => <div>{row.original.product.name}</div>,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.price.toString());
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => <div>{row.original.quantity}</div>,
  },
];

export default function Products() {
  const { data, isPending, isError, error } = useViewCart();
  const { mutate: createOrder } = useCreateOrder(); // Initialize useCreateOrder
  const cartItems = data?.data || [];

  // Calculate total cart amount
  const totalCartAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Initialize table before conditionals
  const table = useReactTable({
    data: cartItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { toast } = useToast();

  const handlePlaceOrder = () => {
    createOrder(undefined, {
      onSuccess: () => {
        toast({
          title: "Order Placed",
          description: "Your order was placed successfully.",
          variant: "default",
        });
      },
      onError: (error) => {
        toast({
          title: "Order Failed",
          description:
            error.message || "An error occurred while placing the order.",
          variant: "destructive",
        });
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center p-4">
        Error: {error?.message || "Failed to load cart items"}
      </div>
    );
  }

  return (
    <div className="mt-16">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-2xl font-semibold">Your Cart</h3>
        <Button
          className="bg-green-700 hover:bg-green-800"
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0}
        >
          Place Order
        </Button>
      </div>
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
              {table.getRowModel().rows.length ? (
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
                    Your cart is empty.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            <tfoot>
              <TableRow>
                <TableCell
                  colSpan={columns.length - 1}
                  className="text-right font-semibold"
                >
                  Total Amount:
                </TableCell>
                <TableCell className="text-right font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalCartAmount)}
                </TableCell>
              </TableRow>
            </tfoot>
          </Table>
        </div>
      </div>
    </div>
  );
}
