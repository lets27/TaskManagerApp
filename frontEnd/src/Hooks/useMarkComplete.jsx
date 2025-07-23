import { useMutation, useQueryClient } from "@tanstack/react-query";
import baseUrl from "../util";
import toast from "react-hot-toast";

const useMarkComplete = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  return useMutation({
    mutationFn: async (taskId) => {
      const response = await fetch(
        `${baseUrl}/api/official/user/task/${taskId}`, // Changed from /api/official/user/task/
        {
          mode: "cors",
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to mark task as complete");
      }
      const updatedTask = await response.json();
      return updatedTask;
    },
    onSuccess: (updatedTask) => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success(updatedTask.message || "Task marked as complete");
    },
    onError: (error) => {
      console.error("Error marking task as complete:", error);
      toast.error(
        error.message || "Service issue, failed to mark task as complete"
      );
    },
  });
};

export default useMarkComplete;
