import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TasksProvider from "./context/taskProvider.jsx";
import UserContextProvider from "./context/userContextProvider.jsx";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable for now to test
      retry: 1, // Allow one retry
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      networkMode: "online",
      structuralSharing: true,
      refetchOnMount: (query) => {
        console.log("Refetching query:", query.queryKey);
        return query.state.data === undefined; // only refetch if no data
      },
    },
  },
});
persistQueryClient({
  queryClient,
  persister: createSyncStoragePersister({
    storage: window.localStorage,
  }),
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserContextProvider>
          {" "}
          {/* Fixed: uppercase component name */}
          <TasksProvider>
            <App />
          </TasksProvider>
        </UserContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
//NOTE:Error boundaries
