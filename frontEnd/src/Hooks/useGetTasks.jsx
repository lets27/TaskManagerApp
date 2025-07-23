import { useQuery } from "@tanstack/react-query";
import baseUrl from "../util";
import useUser from "./useUser";

const useGetTasks = () => {
  const { activeUser } = useUser();
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${baseUrl}/api/official/tasks`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          const error = new Error();
          error.status = response.status;
          error.message = data.message || "Failed to fetch tasks";
          throw error;
        }

        const tasks = data.tasks || [];

        return {
          activeTasks: tasks.filter((task) => task.status === "active"),
          completedTasks: tasks.filter((task) => task.complete === true),
          tasks,
        };
      } catch (error) {
        console.error("Error fetching tasks:", error.message);
        return {
          activeTasks: [],
          completedTasks: [],
          tasks: [],
        }; // return empty arrays if error occurs else it spams the backend
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes,
    retry: 1,
    enabled: !!activeUser, // Only fetch if user is authenticated
  });
};

export default useGetTasks;
