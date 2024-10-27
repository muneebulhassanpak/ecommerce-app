import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppWrapper from "./AppWrapper";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppWrapper />
    </QueryClientProvider>
  );
};

export default App;
