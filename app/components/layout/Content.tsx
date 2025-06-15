import { Outlet } from "react-router";
import { Card } from "../ui/card";

export const Content = () => {
  return (
    <>
      <Card className="my-2 flex h-full w-full flex-col p-4 md:w-4/5 lg:w-3/5">
        <Outlet />
      </Card>
    </>
  );
};

export default Content;
