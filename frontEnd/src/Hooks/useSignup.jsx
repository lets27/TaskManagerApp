import { useMutation, useQueryClient } from "@tanstack/react-query";
import baseUrl from "../util";

const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        body: formData,
        credentials: "include", // For cookie-based auth
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            (response.status === 409
              ? "Email already exists"
              : "Registration failed")
        );
      }

      return await response.json();
    },
    onSuccess: (newUser) => {
      // Immediately set user data to avoid refetch
      queryClient.setQueryData(["user"], newUser);
    },
    onError: (error) => {
      // Clear any partial user data on error
      queryClient.setQueryData(["user"], null);
      console.error("SignIn error:", error.message);
    },
  });
};

export default useSignIn;
