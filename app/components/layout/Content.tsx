import { Outlet } from "react-router";
import { Card, CardContent } from "../ui/card";

export const Content = () => {
  return (
    <Card className="flex h-full w-full flex-1 flex-col p-4 md:w-4/5">
      <CardContent>
        <Outlet />
      </CardContent>
    </Card>
  );
};
