import { Product } from "@/types/DataTypes";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/apiInteraction";
import Spinner from "./Loader";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

const IndividualProduct = ({ _id, name, price, image, rating }: Product) => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const { mutate: addToCart, isPending } = useAddToCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(
      { productId: _id, price },
      {
        onSuccess: () => {
          toast({
            title: "Product Added!",
            description: `${name} has been added to your cart.`,
            variant: "default",
          });
        },
        onError: (error) => {
          toast({
            title: "Error!",
            description:
              error.message || "Something went wrong adding product to cart",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div key={_id} className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
        <img
          alt={name}
          src={`${image}`}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="flex justify-end my-1">
        <p className="px-2 py-1 rounded-md text-xs bg-yellow-50">
          Rating: {rating} stars
        </p>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">{name}</h3>
        </div>
        <p className="text-sm font-medium text-gray-900">${price}</p>
      </div>
      {isLoggedIn && (
        <Button
          className="w-full mt-2 cursor-pointer"
          onClick={handleAddToCart}
        >
          Add To Carts
        </Button>
      )}
    </div>
  );
};

export default IndividualProduct;
