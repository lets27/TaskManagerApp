import useTasks from "../Hooks/useTask";
import Modal from "./Modal";
import ProfileModal from "./ProfileModal";
import { container, item } from "../utils/animations";
import { filteredTasks } from "../utils/utilities";
import useGetTasks from "../Hooks/useGetTasks";
import { motion } from "framer-motion";
import TaskItem from "./TaskItem";
import Filters from "./filters";
import useUser from "../Hooks/useUser";
import MainSideBar from "./MainSideBar";
import AreUSure from "./areUSure";
import { useMemo } from "react";
import { Loader } from "lucide-react";
import useDeleteAll from "../Hooks/useDeleteAllTasks";
import useDeleteCompleted from "../Hooks/useDeleteCompleteTask";

const MainContent = () => {
  const { priority, openModalForAdd, modalMode } = useTasks();
  const { profileOpen } = useUser();
  const { action } = useTasks();

  const { data: allTasks = { activeTasks: [] }, isLoading } = useGetTasks();

  const filtered = useMemo(
    () => filteredTasks(allTasks.activeTasks, priority),
    [allTasks.activeTasks, priority]
  );

  const { mutateAsync: deleteCompletedTasks, isLoading: isDeletingCompleted } =
    useDeleteCompleted();
  const { mutateAsync: deleteAllTasks, isLoading: isDeletingAll } =
    useDeleteAll();

  // Combined loading state
  const anyLoading = isLoading || isDeletingCompleted || isDeletingAll;

  if (anyLoading)
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#EDEDED]">
        <Loader />
      </div>
    );

  return (
    <div className="h-screen main-layout flex-1 bg-[#EDEDED] border-2 relative">
      {modalMode && <Modal />}
      {profileOpen && <ProfileModal />}
      {action && <AreUSure />}

      {/* Loading overlay for mutations */}
      {(isDeletingCompleted || isDeletingAll) && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}

      <main className="m-6 h-full">
        <div className="flex gap-20">
          <Filters />
          <div className="mb-[1.5rem] m-auto flex items-center gap-4">
            <button
              className="h-12 px-6 flex justify-center items-center border-2 
              bg-orange-400 hover:bg-orange-500 
              text-white
              rounded-full 
              transition-all duration-200 ease-in-out
              transform hover:-translate-y-0.5
              active:translate-y-0
              focus:outline-none focus:ring-2 focus:ring-orange-300
              disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => deleteCompletedTasks()}
              disabled={isDeletingCompleted || isDeletingAll}
            >
              {isDeletingCompleted ? "Deleting..." : "Delete Completed Tasks"}
            </button>

            <button
              className="h-12 px-6 flex justify-center items-center border-2 
              bg-red-400 hover:bg-red-500 
              text-white 
              rounded-full 
              transition-all duration-200 ease-in-out
              transform hover:-translate-y-0.5
              active:translate-y-0
              focus:outline-none focus:ring-2 focus:ring-red-300
              disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => deleteAllTasks()}
              disabled={isDeletingAll || isDeletingCompleted}
            >
              {isDeletingAll ? "Deleting..." : "Delete All Tasks"}
            </button>
          </div>
        </div>

        <MainSideBar />

        <motion.div
          className="pb-[2rem] mt-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[1.5rem]"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}

          <motion.button
            className="h-[16rem] w-full py-2 rounded-md text-lg font-medium text-gray-500 border-dashed border-2 border-gray-400 hover:bg-gray-300 hover:border-none transition duration-200 ease-in-out"
            onClick={openModalForAdd}
            variants={item}
          >
            Add New Task
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
};
export default MainContent;
