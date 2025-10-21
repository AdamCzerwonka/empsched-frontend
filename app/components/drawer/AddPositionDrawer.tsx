import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AddPositionForm } from "~/components/form";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { queryKeys } from "~/constants";

export const AddPositionDrawer = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("components/drawer/addPositionDrawer");
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
        <AddPositionForm
          onSuccess={() => {
            setOpen(false);
            queryClient.invalidateQueries({
              queryKey: [queryKeys.getPositions],
            });
          }}
        />
      </DrawerContent>
    </Drawer>
  );
};
