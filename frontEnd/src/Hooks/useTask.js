import { createContext, useContext } from "react";

export const taskContext = createContext(null);

const useTasks = () => {
  const task = useContext(taskContext);

  if (!task) {
    throw new Error("task must be used in router");
  }

  return task;
};

export default useTasks;
