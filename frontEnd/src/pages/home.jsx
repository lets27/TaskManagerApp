import MiniSideBar from "../components/miniSideBar";
import MainContentLayout from "../components/mainContentLayOut";
import MainHeader from "../components/MainHeader";
import MainContent from "../components/MainContent";
import MainSideBar from "../components/MainSideBar";

const home = () => {
  return (
    <>
      <div className="flex ">
        <MiniSideBar />
        <div className=" h-[100vh] pb-[50px] flex-1 flex flex-col">
          <MainHeader />
          <MainContentLayout>
            <MainContent />
          </MainContentLayout>
        </div>
        <MainSideBar />
      </div>
    </>
  );
};

export default home;
