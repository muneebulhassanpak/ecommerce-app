import SignupForm from "@/components/auth/signup";
import LoginForm from "@/components/auth/login";
import { useLocation } from "react-router-dom";

const Auth = () => {
  const { pathname } = useLocation();
  const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  return (
    <div className="w-full">
      {cleanPath == "signup" && <SignupForm />}
      {cleanPath == "login" && <LoginForm />}
    </div>
  );
};

export default Auth;
