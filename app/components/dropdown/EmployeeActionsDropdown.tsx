import { Settings } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ManageEmployeePositionsDrawer } from "~/components/drawer";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui";

interface Props {
  employeeId: string;
}

export const EmployeeActionsDropdown = ({ employeeId }: Props) => {
  const { t } = useTranslation("components/dropdown/employeeActionsDropdown");

  const [openManagePositions, setOpenManagePositions] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Settings />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>{t("settings")}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpenManagePositions(true)}>
            {t("managePositions")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ManageEmployeePositionsDrawer
        employeeId={employeeId}
        renderTrigger={false}
        open={openManagePositions}
        setOpen={setOpenManagePositions}
      />
    </>
  );
};
