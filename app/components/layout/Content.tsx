import { Outlet } from "react-router";
import { Card, CardContent } from "../ui";

export const Content = () => {
  return (
    <Card
      variant={"soft"}
      className="container flex h-full w-full flex-1 flex-col p-4"
    >
      <CardContent className="h-full p-0">
        <Outlet />
      </CardContent>
    </Card>
  );
};
