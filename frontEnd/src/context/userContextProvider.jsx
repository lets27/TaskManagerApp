import { QueryClient, useQuery } from "@tanstack/react-query";
import { userContext } from "../Hooks/useUser.js";
import { useCallback, useMemo, useState } from "react";
import useFetchUser from "../Hooks/fetchUser";
import { useNavigate } from "react-router-dom";

const UserContextProvider = ({ children }) => {
  const { fetchUser, getCachedUser } = useFetchUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [activeUser, setActiveUser] = useState(() => {
    const cached = getCachedUser();
    console.log("Cached user on initialization:", cached);
    return cached !== undefined ? cached : null;
  });

  const openProfileModal = useCallback(() => {
    setProfileOpen(true);
    console.log("open profile");
  }, []);

  const closeModal = useCallback(() => {
    setProfileOpen(false);
  }, []);
  const Navigate = useNavigate();

  const { isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["auth"],
    queryFn: fetchUser,
    initialData: getCachedUser(),
    onSuccess: (user) => {
      localStorage.setItem("user", JSON.stringify(user));
      setActiveUser(user);
      setIsInitialized(true);
    },

    onError: (error) => {
      const cached = getCachedUser();
      setActiveUser(cached !== undefined ? cached : null);

      if (error.status === 401 || error.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setActiveUser(null); //if user is unauthorized or forbidden,
        // remove token and user from localStorage
        Navigate("/login", { replace: true });
      }

      setIsInitialized(true);
    },
    onSettled: (data) => {
      if (!data) {
        setActiveUser(null);
        setIsInitialized(true);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const value = useMemo(
    () => ({
      activeUser,
      setActiveUser,
      setProfileOpen,
      isLoading,
      isInitialized,
      openProfileModal,
      profileOpen,
      closeModal,
      isError,
      error,
      isFetching,
    }),
    [
      activeUser,
      isLoading,
      isInitialized,
      closeModal,
      isError,
      error,
      isFetching,
      setProfileOpen,
      profileOpen,
      openProfileModal,
    ]
  );

  return <userContext.Provider value={value}>{children}</userContext.Provider>;
};

export default UserContextProvider;
