import { useMutation, useQueryClient } from "@tanstack/react-query";
import baseUrl from "../util";
import toast from "react-hot-toast";
import useTasks, { taskContext } from "./useTask";

const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token"); // Get the token from local storage
  const { activeTask } = useTasks();
  return useMutation({
    mutationFn: async (taskId) => {
      console.log("active task submit:", activeTask, "taskId:", taskId);
      const response = await fetch(`${baseUrl}/api/official/task/${taskId}`, {
        credentials: "include",
        mode: "cors",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json", // Set the content type for FormData
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
        body: JSON.stringify(activeTask),
      });

      const task = await response.json(); //parse first
      if (!response.status === 200) {
        throw new Error(task.error.message);
      } else if (response.status === 404) {
        throw new Error(task.error.message || "Task not found");
      } else if (!response.ok) {
        throw new Error(task.error.message || "Update failed");
      }

      console.log("task created:", task);
      return task;
    },
    onError: (error) => {
      console.error(`error deleting task:`, error.message);
      toast.error(error.message || "failed to update task ,try again");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("task updated successfully");
    },
  });
};

export default useUpdateTask;
