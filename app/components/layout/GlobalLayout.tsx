import { Outlet } from "react-router";
import { BackgroundFiller } from "./BackgroundFiller";

export const GlobalLayout = () => {
  return (
    <div className="relative min-h-screen w-full">
      <BackgroundFiller className="opacity-10" />
      <div className="relative flex min-h-screen w-full items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
};

export default GlobalLayout;
