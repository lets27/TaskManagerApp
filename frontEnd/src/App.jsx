import { QueryClient, QueryClientContext } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import MainHeader from "./components/MainHeader";
import RegisterPage from "./pages/registerPage";
import Login from "./pages/loginPage";
import useUser from "./Hooks/useUser";
import { Navigate, Route, Routes } from "react-router-dom";

import MainContentLayOut from "./components/mainContentLayOut";
import MainContent from "./components/MainContent";

function App() {
  const { activeUser, isLoading, isInitialized } = useUser();
  console.log("active user user:", activeUser);
  if (isInitialized || isLoading) {
    console.log("isLoading:", isLoading, "isInitialized:", isInitialized);
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  console.log("isLoading:", isLoading, "isInitialized:", isInitialized);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {activeUser !== null ? (
        <div className="h-full flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <MainHeader user={activeUser} />
            <MainContentLayOut>
              <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainContentLayOut>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
}

export default App;
