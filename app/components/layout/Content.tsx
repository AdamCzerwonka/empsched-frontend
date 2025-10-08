import { Outlet } from "react-router";
import { Card, CardContent } from "../ui";

export const Content = () => {
  return (
    <Card
      variant={"soft"}
      className="flex h-full w-full flex-1 flex-col p-4 md:w-4/5"
    >
      <CardContent className="h-full p-0">
        <Outlet />
      </CardContent>
    </Card>
  );
};
