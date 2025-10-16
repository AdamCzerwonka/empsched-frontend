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

export const AddEmployeeDrawer = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("routes/organisation");
  const { t: tVal } = useTranslation("validation");
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["employees"] });
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Plus /> {t("tabs.employees.add.button")}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>{t("tabs.employees.add.form.title")}</DrawerTitle>
          <DrawerDescription>
            {t("tabs.employees.add.form.briefDescription")}
          </DrawerDescription>
        </DrawerHeader>
        <AddEmployeeForm successCallback={handleSuccess} />
      </DrawerContent>
    </Drawer>
  );
};
