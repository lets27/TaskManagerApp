import { useQueryClient } from "@tanstack/react-query";
import useUser from "./useUser";
import toast from "react-hot-toast";

const useLogout = () => {
  const queryClient = useQueryClient();
  const { setActiveUser } = useUser();

  const logoutUser = () => {
    toast.success("logged out successfully,goodbye!!");
    queryClient.removeQueries(["auth"]);
    queryClient.removeQueries(["tasks"]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setActiveUser(null);
  };
  return { logoutUser };
};

export default useLogout;
