import { QueryClient, QueryClientContext } from "@tanstack/react-query";
import MainHeader from "./components/MainHeader";
import Profile from "./pages/profile";
import RegisterPage from "./pages/registerPage";
import Login from "./pages/loginPage";
import { Navigate, Route, Routes } from "react-router-dom";
import MiniSidebar from "./components/miniSideBar";
import MainSideBar from "./components/MainSideBar";
import MainContent from "./components/MainContent";
import useUser from "./Hooks/useUser";

const AuthWrapper = () => {
  const { activeUser, isInitialized, isLoading } = useUser();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/login"
        element={activeUser ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected routes */}
      {activeUser ? (
        <Route
          path="/*"
          element={
            <div className="h-full flex overflow-hidden">
              <MiniSidebar />
              <div className="flex-1 flex flex-col">
                <MainHeader user={activeUser} />
                <MainContentLayOut>
                  <Routes>
                    <Route path="/" element={<MainContent />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <MainSideBar />
                </MainContentLayOut>
              </div>
            </div>
          }
        />
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

export default AuthWrapper;
