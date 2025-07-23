import useGetTasks from "../Hooks/useGetTasks";
import Modal from "./Modal";
import ProfileModal from "./ProfileModal";

function MainLayout({ children }) {
  const { isEditing, profileModal } = useGetTasks();
  return (
    <div className="main-layout flex-1 bg-[#EDEDED] border-2 border-white rounded-[1.5rem] overflow-auto">
      {isEditing && <Modal />}
      {profileModal && <ProfileModal />}
      {children}
    </div>
  );
}

export default MainLayout;
