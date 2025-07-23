import useGetTasks from "../Hooks/useGetTasks";
import useUser from "../Hooks/useUser";

function Profile() {
  const { activeUser, openProfileModal } = useUser();

  const {
    //setting up default structure for tasks incoming to avoid undefined errors
    data: allTasks = { activeTasks: [], completedTasks: [], tasks: [] },
    // isLoading: tasksLoading,
  } = useGetTasks();

  const completedTasks = allTasks.completedTasks;
  const activeTasks = allTasks.activeTasks;
  const totalTasks = allTasks.tasks;
  return (
    <div className="m-6">
      <div
        className="px-2 py-4 flex items-center gap-3 bg-[#E6E6E6]/20 rounded-[0.8rem]
        hover:bg-[#E6E6E6]/50 transition duration-300 ease-in-out cursor-pointer border-2 border-transparent hover:border-2 hover:border-white"
        onClick={openProfileModal}
      >
        <div>
          <img
            src={activeUser?.profilePicture}
            alt="avatar"
            width={50}
            height={50}
            className="rounded-full object-cover w-[50px] h-[50px]"
          />
        </div>
        <div>
          <h1 className="flex flex-col text-xl">
            <span className="text-lg font-medium">{activeUser?.username}</span>
          </h1>
        </div>
      </div>
      <h3 className="mt-8 font-medium">Activity</h3>
      <div className="mt-6 flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-gray-400">
            <p>Total Tasks:</p>
            <p className="pl-4 relative flex gap-2">
              <span className="absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-purple-500 rounded-[5px]"></span>
              <span className="font-medium text-4xl text-[#333]">
                {totalTasks.length}
              </span>
            </p>
          </div>
          <div className="text-gray-400">
            <p>In Progress:</p>
            <p className="pl-4 relative flex gap-2">
              <span className="absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-[#3AAFAE] rounded-[5px]"></span>
              <span className="font-medium text-4xl text-[#333]">
                {activeTasks.length}
              </span>
            </p>
          </div>
          <div className="text-gray-400">
            <p>Open Tasks:</p>
            <p className="pl-4 relative flex gap-2">
              <span className="absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-orange-400 rounded-[5px]"></span>
              <span className="font-medium text-4xl text-[#333]">
                {activeTasks.length}
              </span>
            </p>
          </div>
          <div className="text-gray-400">
            <p>Completed:</p>
            <p className="pl-4 relative flex gap-2">
              <span className="absolute h-[70%] w-[0.2rem] left-[1px] top-1/2 translate-y-[-50%] bg-green-400 rounded-[5px]"></span>
              <span className="font-medium text-4xl text-[#333]">
                {completedTasks.length}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
