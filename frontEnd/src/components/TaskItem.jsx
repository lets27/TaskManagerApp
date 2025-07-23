import useTasks from "../Hooks/useTask";
import IconCheck from "../icons/IconCheck";
import IconDeleteAll from "../icons/IconDeleteAll";
import IconFileCheck from "../icons/iconFileCheck";
import { item } from "../utils/animations";
import { formatTime } from "../utils/utilities";
import { motion } from "framer-motion";
import deleteIcon from "../assets/deleteIcon.png";
import pen from "../assets/pen.png";
import check from "../assets/check.png";

import useMarkComplete from "../Hooks/useMarkComplete";
import { Loader } from "lucide-react";

function TaskItem({ task }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-red-500";
      default:
        return "text-red-500";
    }
  };

  const { openModalForEdit } = useTasks();
  const { mutateAsync: completeTask, isLoading } = useMarkComplete();
  // const { mutateAsync: deleteTask, isFetching } = useDeleteTask();
  const { setActiveTask, openModalForTaskDelete } = useTasks();

  console.log("task Item:", task);

  // if (isFetching) return <p>deleting task....</p>;
  return (
    <motion.div
      className={`h-[16rem] px-4 py-3 flex flex-col gap-4 shadow-sm bg-[#f9f9f9] rounded-lg border-2 border-white relative`} // Added relative here
      variants={item}
    >
      {/* Task Content */}
      <div className={task.complete ? "opacity-50" : ""}>
        <h4 className="font-bold text-2xl">{task.taskName}</h4>
        <p>{task.description}</p>
      </div>

      {/* COMPLETE Overlay - only for completed tasks */}
      {task.complete && (
        <div className="absolute inset-0 bg-white bg-opacity-70 rounded-lg flex items-center justify-center z-10">
          <span className="text-2xl font-bold text-gray-500 uppercase tracking-widest rotate-[-15deg]">
            Complete
            {isLoading ? <Loader /> : null}
          </span>
        </div>
      )}

      <div className="mt-auto flex justify-between items-center">
        <p className="text-sm text-gray-400">{formatTime(task.createdAt)}</p>
        <p className={`text-sm font-bold ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </p>
        <div>
          <div className="flex items-center gap-3 text-gray-400 text-[1.2rem]">
            <img
              src={check}
              height={20}
              width={20}
              className={`${
                task.complete
                  ? "text-yellow-400"
                  : "text-gray-400 cursor-pointer"
              }`}
              onClick={async () => {
                await completeTask(task._id);
              }}
            />

            <img
              src={pen}
              height={20}
              width={20}
              className="text-[#00A1F1] cursor-pointer"
              onClick={() => {
                setActiveTask(task);
                openModalForEdit();
              }}
            />

            <img
              src={deleteIcon}
              width={20}
              height={20}
              className="text-[#F65314] cursor-pointer"
              onClick={() => {
                openModalForTaskDelete(task);
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default TaskItem;
