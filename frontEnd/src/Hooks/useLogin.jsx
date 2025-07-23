import { useMutation, useQueryClient } from "@tanstack/react-query";
import baseUrl from "../util";
import useUser from "./useUser";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const Navigate = useNavigate();
  const queryClient = useQueryClient(); // use existing query client
  const { setActiveUser } = useUser();
  return useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        mode: "cors",
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), //stringify for non FormData types
      });

      const user = await response.json(); //parse

      if (!response.ok) {
        throw new Error(user.error.message);
      } else if (response.status === 404) {
        throw new Error(user.error.message || "user not found");
      }

      return user;
    },
    onSuccess: (newUser) => {
      // Update cache and state
      queryClient.setQueryData(["auth"], { user: newUser.user });
      localStorage.setItem("token", newUser.token);
      setActiveUser(newUser.user);
      localStorage.setItem("user", JSON.stringify(newUser.user));

      // Invalidate related queries
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes(["tasks"]),
      });

      // Navigate and notify
      Navigate("/home");
      toast.success("Login successful");
    },
    onError: (error) => {
      // Clear user data on error
      queryClient.setQueryData(["user"], null);
      toast.error(error.message || "An error occurred during login");
    },
  });
};

export default useLogin;
