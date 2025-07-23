// hooks/useDeleteCompleted.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import baseUrl from "../util";

const useDeleteCompleted = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(
        `${baseUrl}/api/official/user/tasks/completed`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete completed tasks");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success(data.message || "Completed tasks deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export default useDeleteCompleted;
