import useGetTasks from "../Hooks/useGetTasks";
import useTasks from "../Hooks/useTask";
import useUser from "../Hooks/useUser";
import { github, moon, profile } from "../utils/icons";
import { Link } from "react-router-dom";

const MainHeader = () => {
  const { activeUser } = useUser();

  const {
    data: allTasks = { activeTasks: [], completedTasks: [] },
    isLoading,
  } = useGetTasks();
  const { openModalForAdd } = useTasks();

  // Provide default empty array if undefined
  const activeTasks = allTasks.activeTasks || [];
  const username = activeUser?.username || "";

  const email = activeUser?.email;

  if (isLoading) return <div>Loading...</div>;

  return (
    <header className="px-6  my-[4px] mb-[24px] w-full flex items-center justify-between bg-[#f9f9f9]">
      <div>
        <h1 className="text-lg font-medium">
          <span role="img" aria-label="wave">
            👋
          </span>
          {email ? `Welcome, ${username}!` : "Welcome to Taskfyer"}
        </h1>
        <p className="text-sm">
          {email ? (
            <>
              You have{" "}
              <span className="font-bold text-[#3aafae]">
                {activeTasks.length}
              </span>
              &nbsp;active tasks
            </>
          ) : (
            "Please login or register to view your tasks"
          )}
        </p>
      </div>
      <div className="h-[50px] flex items-center gap-[10.4rem]">
        <button
          className={`px-8 py-3 rounded-[50px] transition-all duration-200 ease-in-out
    ${
      email
        ? "bg-[#3aafae] hover:bg-[#00A1F1] text-white hover:text-white shadow-md hover:shadow-lg"
        : "bg-gray-400 hover:bg-gray-500 text-white hover:text-white"
    }
    transform hover:-translate-y-1 active:translate-y-0`}
          onClick={() => {
            if (email) {
              openModalForAdd();
            }
          }}
        >
          {email ? "Add a new Task" : "Login / Register"}
          <span className="ml-2">{email ? "+" : "→"}</span>
        </button>
      </div>
    </header>
  );
};

export default MainHeader;
