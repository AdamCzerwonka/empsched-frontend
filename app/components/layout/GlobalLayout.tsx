import { Outlet } from "react-router";
import { BackgroundFiller } from "./BackgroundFiller";

interface Props {
  children?: React.ReactNode;
}

export const GlobalLayout = ({ children }: Props) => {
  return (
    <div className="relative min-h-screen w-full">
      <BackgroundFiller className="opacity-10 dark:opacity-[2%]" />
      <div className="relative flex min-h-screen w-full items-center justify-center">
        {children ?? <Outlet />}
      </div>
    </div>
  );
};

export default GlobalLayout;
