import { useEffect, useRef } from "react";
import useTasks from "../Hooks/useTask";
import useUpdateTask from "../Hooks/useUpdateTask";
import useDetectOutside from "../Hooks/useDetectOutside";
import useCreateTask from "../Hooks/useCreateTask";

function Modal() {
  const {
    // isEditing,
    closeModal,
    isEditing,
    modalMode,
    setActiveTask,
    activeTask,
  } = useTasks();
  const ref = useRef(null);

  const taskId = activeTask._id;
  console.log("modal active:", activeTask);
  const { mutateAsync: createTask } = useCreateTask();
  const {
    // data: updatedTask,
    // isLoading: isUpdatingTask,
    // isError: isTaskEditError,
    // error: editTaskError,
    mutateAsync: updateTask,
  } = useUpdateTask();

  // Use the hook to detect clicks outside the modal
  useDetectOutside({
    ref,
    callback: () => {
      if (isEditing) {
        closeModal(); // Close modal if it is in add/edit mode
      }
    },
  });

  const handleInput = (name, e) => {
    const { value } = e.target;
    setActiveTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modalMode === "edit") {
      await updateTask(taskId);
    } else if (modalMode === "add") {
      await createTask(activeTask);
    }
    closeModal();
  };

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-[#333]/30 overflow-hidden">
      <form
        action=""
        className="py-5 px-6 max-w-[520px] w-full flex flex-col gap-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md"
        onSubmit={handleSubmit}
        ref={ref}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="taskName">Title</label>
          <input
            className="bg-[#F9F9F9] p-2 rounded-md border"
            type="text"
            id="taskName"
            placeholder="Task Title"
            name="taskName"
            value={activeTask.taskName}
            onChange={(e) => handleInput("taskName", e)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="description">Description</label>
          <textarea
            className="bg-[#F9F9F9] p-2 rounded-md border resize-none"
            name="description"
            placeholder="Task Description"
            rows={4}
            value={activeTask.description}
            onChange={(e) => handleInput("description", e)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="priority">Select Priority</label>
          <select
            className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
            name="priority"
            value={activeTask.priority}
            onChange={(e) => handleInput("priority", e)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="dueDate">Due Date</label>
          <input
            className="bg-[#F9F9F9] p-2 rounded-md border"
            type="date"
            name="dueDate"
            value={activeTask.dueDate}
            onChange={(e) => handleInput("dueDate", e)}
          />
        </div>

        <div className="mt-8">
          <button
            type="submit"
            className={`text-white py-2 rounded-md w-full hover:bg-blue-500 transition duration-200 ease-in-out ${
              modalMode === "edit" ? "bg-blue-400" : "bg-green-400"
            }`}
          >
            {modalMode === "edit" ? "Update Task" : "Create Task"}
            {/* {isFetching && modalMode === "edit"
              ? "editing in progress..."
              : "creating task..."} */}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Modal;
