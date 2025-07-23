import { useMutation, useQueryClient } from "@tanstack/react-query";
import baseUrl from "../util";
import toast from "react-hot-toast";

const useRegister = () => {
  const queryClient = useQueryClient(); // use existing query client
  return useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`${baseUrl}/api/auth/signup`, {
        mode: "cors",
        method: "POST",
        body: formData,
      });

      const user = await response.json(); // parsed response
      console.log("response:", user);
      // console.log("response:", response);
      if (!response.status.ok) {
        throw new Error(user.error.message);
      } else if (response.status === 400) {
        throw new Error(
          response.error || "Account with this email already exists"
        );
      }

      if (!user || !user.user) {
        throw new Error("User creation failed, please try again later");
      }

      console.log("user created:", user);
      return user;
    },
    onSuccess: (newUser) =>
      queryClient.setQueryData(["user"], () => {
        return newUser;
      }),
    onError: (error) => {
      // Clear user data on error
      console.error("errorLetso:", error);
      queryClient.setQueryData(["user"], null);

      toast.error(error.message || "An error occurred");
    },
  });
};

export default useRegister;
