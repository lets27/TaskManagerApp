import { useQueryClient } from "@tanstack/react-query";
import baseUrl from "../util";
import { useCallback } from "react";

const useFetchUser = () => {
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const getCachedUser = useCallback(() => {
    const cachedQueryUser = queryClient.getQueryData(["auth"])?.user;
    if (cachedQueryUser) return cachedQueryUser;

    const localUser = localStorage.getItem("user");
    return localUser ? JSON.parse(localUser) : null;
  }, [queryClient]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/official/user`, {
        method: "GET",
        credentials: "include",
        mode: "cors",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = new Error("Failed to fetch user");
        error.status = response.status; // <- add status!
        throw error;
      }

      const data = await response.json();

      const user = data.user;

      return user || null;
    } catch (error) {
      console.log(error.message);
      throw error; //trigger on error
    }
  };
  return {
    fetchUser,
    getCachedUser, //get cached user data from useLogin
  };
};

export default useFetchUser;
