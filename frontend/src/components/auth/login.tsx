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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { BackendError, useLogin } from "@/apiInteraction";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { ApiResponse, LoginResponse } from "@/types/DataTypes";
import { useDispatch } from "react-redux";
import { login as loginAction } from "@/store/userSlice";

export default function LoginForm() {
  const { mutate: register, isPending } = useLogin();
  const { toast } = useToast();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const formSchema = z.object({
    email: z.string().email({
      message: "Must be a valid email.",
    }),
    password: z.string().min(1, { message: "Password is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    register(values, {
      onSuccess: (data: ApiResponse<LoginResponse>) => {
        toast({
          title: "Login Successful!",
          description: `Welcome back ${data.data.name}`,
          variant: "default",
        });
        dispatch(loginAction(data.data));
        data.data.role == "admin"
          ? navigate("/dashboard")
          : navigate("/dashboard/orders");
      },
      onError: (error: AxiosError<BackendError>) => {
        const errorMessage = error.response?.data?.errors
          ? Object.values(error.response.data.errors)[0]?.[0]
          : error.response?.data?.message ||
            "Something went wrong. Please try again.";

        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
        });
      },
    });
  }

  return (
    <>
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="*******" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Verifying..." : "Login"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="underline">
              Signup
            </Link>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
