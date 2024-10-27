import { Loader2 } from "lucide-react";

const Spinner = () => {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] w-full h-full grid place-items-center">
      <Loader2 className="mr-2 h-20 w-20 text-white animate-spin" />
    </div>
  );
};

export default Spinner;
