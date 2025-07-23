import { useMutation, useQueryClient } from "@tanstack/react-query";
import baseUrl from "../util";
import toast from "react-hot-toast";
import useTasks from "./useTask";

const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const { setConsent } = useTasks();

  return useMutation({
    mutationFn: async (taskId) => {
      const response = await fetch(`${baseUrl}/api/official/task/${taskId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        return taskId; // Return the ID for cache updates
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete task");
      }
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      toast.error(error.message || "Service issue, failed to delete");
    },
    onSuccess: () => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};

//other way of doing the map
//  queryClient.setQueryData(["tasks"], (oldTasks) =>{
//    //outer map is the final array returned by the map function
//    //inner map is used to check if the task id matches the updated task id
//         return oldTasks.map((task)=>{
//             if(task._id===deletedTask._id){
//                 return deletedTask;// this will return the updated task if it matches the updated task id
//             }
//             return task;// this will return the task if it does not match the updated task id
//         })
//      })
// }

export default useDeleteTask;
