import IndividualProduct from "@/components/shared/product";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useProducts } from "@/apiInteraction";
import { useState } from "react";
import { ProductFilters } from "@/types/DataTypes";
import Spinner from "@/components/shared/Loader";
import CustomPagination from "@/components/product/CustomPagination";

export default function Shop() {
  const formSchema = z
    .object({
      minPrice: z
        .number()
        .min(1, { message: "Minimum must be a positive number." }),
      maxPrice: z
        .number()
        .min(2, { message: "Maximum must be a positive number." }),
      rating: z.string().transform((value) => {
        const numberValue = Number(value);
        return isNaN(numberValue) ? 0 : numberValue;
      }),
    })
    .refine((data) => data.minPrice < data.maxPrice, {
      message: "Minimum must be smaller than Maximum.",
      path: ["minimum"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      minPrice: 1,
      maxPrice: 100,
      rating: 1,
    },
  });

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    pageSize: 10,
    minPrice: undefined,
    maxPrice: undefined,
    rating: undefined,
  });

  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useProducts(filters);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return (
      <div>
        Error: {error.response?.data?.message || "Something went wrong"}
      </div>
    );
  }

  const pagination = productsData?.pagination;

  return (
    <>
      <section className="py-24 relative">
        <div className="w-full max-w-7xl mx-auto flex justify-between">
          <div className="box rounded-xl border border-gray-300 bg-white p-6 w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => {
                  setFilters((prev) => ({ ...prev, ...values }));
                })}
                className="space-y-8"
              >
                <div className="flex flex-col md:flex-row justify-between w-full gap-5">
                  {/* Price Filters */}
                  <div className="md:w-1/4">
                    <h5 className="text-lg mb-2">Price</h5>
                    <div className="flex justify-between gap-1">
                      <FormField
                        control={form.control}
                        name="minPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Minimum</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="11"
                                {...field}
                                type="number"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value ? Number(value) : 1);
                                }}
                                className="rounded-full"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="maxPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maximum</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="121"
                                className="rounded-full"
                                {...field}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value ? Number(value) : 2);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="md:w-3/4 flex flex-col sm:flex-row justify-between gap-8 border-l pl-4 min-h-full">
                    <div className="w-10/12 flex flex-wrap justify-between flex-row gap-3">
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <h5 className="text-lg mb-2">Rating</h5>
                            <FormControl>
                              <RadioGroup
                                {...field}
                                value={field.value?.toString() ?? "1"}
                                onValueChange={(value) =>
                                  field.onChange(
                                    value === "0" ? 0 : Number(value)
                                  )
                                }
                                className="flex flex-wrap gap-2 justify-between"
                              >
                                {/* Adding Not Rated Option */}
                                <FormItem className="flex items-center gap-1">
                                  <FormControl>
                                    <RadioGroupItem value="0" />
                                  </FormControl>
                                  <FormLabel className="ml-2">
                                    Not Rated
                                  </FormLabel>
                                </FormItem>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <FormItem
                                    key={rating}
                                    className="flex items-center gap-1"
                                  >
                                    <FormControl>
                                      <RadioGroupItem
                                        value={rating.toString()}
                                      />
                                    </FormControl>
                                    <FormLabel className="ml-2">
                                      {rating} Star
                                    </FormLabel>
                                  </FormItem>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="sm:w-2/12 flex justify-center items-center">
                      <Button
                        type="submit"
                        className="w-full px-2 py-2.5 flex items-center justify-center gap-2 rounded-full bg-indigo-600 text-white font-semibold text-xs shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-200"
                      >
                        Filter Results
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {(productsData?.data?.length ?? 0) > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {productsData?.data.map((product) => (
              <IndividualProduct {...product} key={product._id} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center flex-col items-center">
            <p className="text-center my-5 text-2xl">
              No products match your filters
            </p>
          </div>
        )}

        {pagination && (
          <CustomPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            onPageSizeChange={(pageSize) =>
              setFilters((prev) => ({ ...prev, pageSize }))
            }
            totalEntries={pagination.totalEntries}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        )}
      </section>
    </>
  );
}
