import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AddEmployeeForm } from "~/components/form";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui";
import { queryKeys } from "~/constants";

export const AddEmployeeDrawer = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("components/drawer/addEmployeeDrawer");
  const queryClient = useQueryClient();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Plus /> {t("triggerButton")}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>{t("form.title")}</DrawerTitle>
          <DrawerDescription>{t("form.briefDescription")}</DrawerDescription>
        </DrawerHeader>
        <AddEmployeeForm
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: [queryKeys.getEmployees],
            });
            setOpen(false);
          }}
        />
      </DrawerContent>
    </Drawer>
  );
};
