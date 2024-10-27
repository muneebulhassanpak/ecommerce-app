import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { User } from "@/types/DataTypes";
import { useUpdateProfile } from "@/apiInteraction";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/userSlice";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function Profile() {
  const userData = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const [user, setUser] = useState<User>({
    name: "",
    role: "user",
    email: "",
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: userData?.name || "",
      email: userData?.email || "",
    },
  });

  useEffect(() => {
    form.reset({
      name: userData?.name || "",
      email: userData?.email || "",
    });
  }, [userData, form]);

  const {
    mutate: updateProfile,
    isPending,
    isError,
    error,
  } = useUpdateProfile();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const dataToSend = { ...data, role: user.role };
    updateProfile(dataToSend, {
      onSuccess: (updatedUser) => {
        setUser(updatedUser.data);
        dispatch(updateUser(updatedUser.data));
        toast({
          title: "Update Successful!",
          description: `Profile was updated successfully`,
          variant: "default",
        });
      },
      onError: (error) => {
        console.error("Failed to update profile:", error);
      },
    });
  }

  return (
    <div className="w-[95%] mt-10 sm:w-full max-w-2xl mx-auto border p-4 rounded-md">
      <Form {...form}>
        <h4 className="my-4 font-semibold text-xl">Your Profile</h4>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="user@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Updating..." : "Update"}
          </Button>

          {isError && <p className="text-red-500">Error: {error.message}</p>}
        </form>
      </Form>
    </div>
  );
}
