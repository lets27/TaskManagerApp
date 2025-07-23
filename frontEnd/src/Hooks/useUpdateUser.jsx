import { useMutation, useQueryClient } from "@tanstack/react-query";
import baseUrl from "../util";
import useUser from "./useUser";
import toast from "react-hot-toast";

const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { setActiveUser, activeUser } = useUser();
  const token = localStorage.getItem("token");
  return useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`${baseUrl}/api/official/user`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const updatedUser = await response.json();
      if (!response.ok) {
        throw new Error(updatedUser.error.message);
      }

      return updatedUser;
    },
    onMutate: async (formData) => {
      await queryClient.cancelQueries(["auth"]);
      const previousUser = queryClient.getQueryData(["auth"]);

      // Optimistically update both cache and context
      const updates = Object.fromEntries(formData.entries());
      const newUser = { ...previousUser, ...updates };

      queryClient.setQueryData(["auth"], newUser);
      // setActiveUser(newUser); // Sync with context

      return { previousUser };
    },
    onSuccess: (updatedUser) => {
      // Replace optimistic data with confirmed server state
      queryClient.setQueryData(["auth"], updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser.user));
      setActiveUser(updatedUser.user);
      console.log("active after update:", activeUser);
      // Invalidate related data that might depend on user
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Profile updated successfully");
    },
    onError: (error, variables, context) => {
      // 1. Roll back to pre-mutation state
      if (context?.previousUser !== undefined) {
        // Explicit null check
        queryClient.setQueryData(["auth"], context.previousUser);
      }
      toast.error(error.message);
    },
    // Critical for UX consistency
    retry: (failureCount, error) => {
      return !error.message.includes("401") && failureCount < 2;
    },
  });
};

export default useUpdateUser;
