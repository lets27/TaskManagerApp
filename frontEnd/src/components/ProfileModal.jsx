import { useRef, useState } from "react";
import useUser from "../Hooks/useUser";
import useUpdateUser from "../Hooks/useUpdateUser";
import useDetectOutside from "../Hooks/useDetectOutside";

function ProfileModal() {
  const ref = useRef(null);
  const { activeUser, closeModal } = useUser();
  // Fixed useState initialization - added proper destructuring
  const [currentUser, setCurrentUser] = useState(() => ({ ...activeUser }));
  const { mutateAsync: updateUser } = useUpdateUser();
  const { setProfileOpen } = useUser();
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentUser((prev) => ({ ...prev, profilePicture: file }));

      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setCurrentUser((prev) => ({
        ...prev,
        profilePicturePreview: previewUrl,
      }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();

    Object.entries(currentUser).forEach(([key, value]) => {
      // Skip the preview property
      if (
        value !== undefined &&
        value !== null &&
        key !== "profilePicturePreview"
      ) {
        dataToSend.append(key, value);
      }
    });

    try {
      await updateUser(dataToSend);
      // closeModal();
      setProfileOpen(false); // Ensure
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useDetectOutside({
    ref,
    callback: () => {
      closeModal();
    },
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setCurrentUser((prev) => ({ ...prev, [name]: value }));
  };

  // Get the image source - use preview if available, otherwise use the stored URL or default
  const imageSrc =
    currentUser?.profilePicturePreview ||
    currentUser?.profilePicture ||
    "/default-profile.png";

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-[#333]/30 overflow-hidden">
      <div
        ref={ref}
        className="py-5 px-6 max-w-[520px] w-full flex flex-col gap-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md border-2 border-white"
      >
        <div className="absolute left-0 top-0 w-full h-[80px] bg-[#323232]/10 rounded-tr-md rounded-tl-md"></div>

        <div className="mt-4 relative flex justify-between">
          <div className="relative inline-block">
            <img
              src={imageSrc}
              alt="profile"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            <div className="mb-4">
              <label
                htmlFor="profilePicture"
                className="block text-sm font-medium text-gray-700"
              >
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                accept="image/*"
                onChange={handleImage}
                className="mt-1 block w-full px-3 py-2 border border-amber-500 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
          <div className="self-end flex items-center gap-2">
            <button className="flex items-center gap-2 border-2 border-[#323232]/10 rounded-md py-1 px-3 text-xs font-medium text-[#323232]">
              Github
            </button>
            <button className="flex items-center gap-2 border-2 border-[#323232]/10 rounded-md py-1 px-3 text-xs font-medium text-[#323232]">
              Verified
            </button>
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold">{currentUser?.username || ""}</h1>
          <p className="text-sm text-gray-500">{currentUser?.email || ""}</p>
        </div>

        <form
          className="mt-4 pt-2 flex flex-col gap-4 border-t-2 border-t-[#323232]/10"
          onSubmit={onSubmit}
        >
          <div className="pt-2 grid grid-cols-[150px_1fr]">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={currentUser?.username || ""}
              onChange={handleUserInput}
              className="py-[0.4rem] px-3 font-medium rounded-lg border-2 border-[#323232]/10"
            />
          </div>

          <div className="pt-4 grid grid-cols-[150px_1fr] border-t-2 border-t-[#323232]/10">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <div className="relative w-full">
              <input
                type="email"
                id="email"
                name="email"
                value={currentUser?.email || ""}
                onChange={handleUserInput}
                className="w-full py-[0.4rem] pl-9 pr-2 font-medium rounded-lg border-2 border-[#323232]/10"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 border-t-2 border-t-[#323232]/10">
            <button
              type="button"
              onClick={closeModal}
              className="mt-3 py-2 px-4 bg-transparent text-black text-sm font-medium rounded-md border-2 border-[#323232]/10 hover:bg-[#EB4E31] hover:border-transparent hover:text-white transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="mt-3 py-2 px-4 bg-[#3aafae] text-white text-sm font-medium rounded-md hover:bg-[#2e8d8c]/90 transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;
