import { useState } from "react";
import { taskContext } from "../Hooks/useTask";

const TasksProvider = ({ children }) => {
  const [priority, setPriority] = useState("All");
  const [action, setAction] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [profileModal, setProfileModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); //flag for modal open
  const [isAdding, setIsAdding] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [activeTask, setActiveTask] = useState({});
  const [consent, setConsent] = useState(false);

  const openModalForAdd = () => {
    setModalMode("add");
    setIsAdding(true);
    setIsEditing(true);
    setActiveTask({});
    console.log("click gang");
  };

  const openModalForTaskDelete = (task) => {
    setAction(true);
    setActiveTask(task);
    console.log("click gang");
  };

  console.log("modal mode:", modalMode);

  const openModalForEdit = () => {
    setModalMode("edit");
    setIsEditing(true);
    console.log("selected edit task:", activeTask);
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setIsAdding(false);
    setModalMode("");
    setActiveTask(null);
    setAction(false);
  };

  console.log("isEditing:", isEditing);
  const handleInput = (name, e) => {
    const { value } = e.target;
    setActiveTask({ ...activeTask, [name]: value });
  };

  return (
    <taskContext.Provider
      value={{
        priority,
        confirm,
        setConfirm,
        setPriority,
        isEditing,
        setIsEditing,
        openModalForAdd,
        openModalForEdit,
        activeTask,
        setActiveTask,
        closeModal,
        modalMode,
        openProfileModal,
        isAdding,
        profileModal,
        action,
        setAction,
        handleInput,
        consent,
        setConsent,
        openModalForTaskDelete,
      }}
    >
      {children}
    </taskContext.Provider>
  );
};

export default TasksProvider;
// const {
//   data: allTasks,
//   isLoading: tasksLoading,
//   isError: isTaskError,
//   error: taskError,
// } = useGetTasks();

// const {
//   data: updatedTask,
//   isLoading: isUpdatingTask,
//   isError: isTaskEditError,
//   error: editTaskError,
// } = useUpdateTask();

// const {
//   isLoading: isDeleting,
//   isError: isDeleteTaskError,
//   error: deleteTaskError,
//   mutateAsync: deleteTask,
// } = useDeleteTask();
// const {
//   data: createdTask,
//   isLoading: createTaskLoading,
//   isError: isCreateError,
//   error: createTaskError,
//   mutateAsync: createTask,
// } = useCreateTask();
