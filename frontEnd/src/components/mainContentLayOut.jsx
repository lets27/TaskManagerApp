const MainContentLayOut = ({ children }) => {
  //   const { user } = useUser();
  const userId = 2;
  return (
    <main
      className={`${
        userId ? "pr[20rem]" : "null"
      } pb[1.5rem] flex h-[100vh] ml-[10px]  bg-[#EDEDED] flex-wrap w-[76%] `}
    >
      {children}
    </main>
  );
};

export default MainContentLayOut;
