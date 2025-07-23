// hooks/useDeleteAll.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import baseUrl from "../util";
import toast from "react-hot-toast";

const useDeleteAll = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${baseUrl}/api/official/user/tasks/all`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete all tasks");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success(data.message || "All tasks deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export default useDeleteAll;
