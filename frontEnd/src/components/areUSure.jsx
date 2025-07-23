import { useRef, useState } from "react";
import useTasks from "../Hooks/useTask";
import useDetectOutside from "../Hooks/useDetectOutside";
import useDeleteTask from "../Hooks/useDeleteTask";

const AreUSure = () => {
  const { activeTask, action, closeModal, consent, setConsent } = useTasks();
  const ref = useRef(null);
  const { mutateAsync: deleteTask, isFetching } = useDeleteTask();
  useDetectOutside({
    ref,
    callback: () => {
      if (action) {
        closeModal(); // Close modal if it is in add/edit mode
      }
    },
  });

  if (isFetching) return <p>deleting task....</p>;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="w-[300px] bg-white p-6 rounded-lg border-2 border-red-500 shadow-xl"
        ref={ref}
      >
        <div className="flex flex-col gap-5">
          <p className="text-gray-800">
            Are you sure you want to delete "{activeTask.taskName}"?
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => {
                setConsent(false);
                closeModal();
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              onClick={async () => {
                await deleteTask(activeTask._id);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreUSure;
