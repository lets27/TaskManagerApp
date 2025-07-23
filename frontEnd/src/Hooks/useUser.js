import { createContext, useContext } from "react";

export const userContext = createContext(undefined);

const useUser = () => {
  try {
    const user = useContext(userContext); //get the existing context
    if (user === undefined) {
      throw new Error("useUser must be used within a UserProvider");
    }
    return user;
  } catch (error) {
    console.log(error);
  }
};

export default useUser;
