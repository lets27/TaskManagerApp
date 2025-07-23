import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import baseUrl from "../util";
import toast from "react-hot-toast";

const useCreateTask = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  return useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`${baseUrl}/api/official/task`, {
        mode: "cors",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw new Error(data.error.message || "Failed to create task");
      }

      console.log("task created:", data.task);
      return data.task;
    },
    onError: (error) => {
      console.error(`Error creating task:`, error.message);
      toast.error(
        error.message || "failed creating task try again in a moment"
      );
    },
    onSuccess: () => {
      toast.success("task created successfully");
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};

export default useCreateTask;
