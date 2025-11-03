import { useState } from "react";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { AddAbsenceForm } from "../form";
import { queryKeys } from "~/constants";

export const AddAbsenceDrawer = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("components/drawer/addAbsenceDrawer");
  const queryClient = useQueryClient();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Plus /> {t("triggerButton")}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("form.title")}</DrawerTitle>
          <DrawerDescription>{t("form.briefDescription")}</DrawerDescription>
        </DrawerHeader>
        <AddAbsenceForm
          onSuccess={() => {
            queryClient.invalidateQueries({
              queryKey: [queryKeys.getSelfAbsences],
            });
            setOpen(false);
          }}
        />
      </DrawerContent>
    </Drawer>
  );
};
