import useLogout from "../Hooks/useLogOut";
import Profile from "../pages/profile";

function MainSideBar() {
  const { logoutUser } = useLogout();
  return (
    <>
      <div className="w-[20rem] mt-[5rem] h-[calc(100%-5rem)] fixed right-0 top-0 bottom-10 bg-[#f9f9f9] flex flex-col">
        <Profile />
        <button
          className="mt-auto mb-6 mx-6 py-4 px-8 
            bg-[#EB4E31] hover:bg-[#3aafae] 
            text-white font-medium
            rounded-[50px] 
            transition-all duration-200 ease-in-out
            transform hover:-translate-y-1 active:translate-y-0
            shadow-md hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-[#EB4E31] focus:ring-opacity-50"
          onClick={logoutUser}
        >
          <span className="flex items-center justify-center gap-2">
            Sign Out
            <svg
              xmlns="http://www.w3.org/2000/svg" //importing svg icon
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </span>
        </button>
      </div>
    </>
  );
}

export default MainSideBar;
