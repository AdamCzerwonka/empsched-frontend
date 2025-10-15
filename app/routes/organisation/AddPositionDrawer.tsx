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
  const { t } = useTranslation("routes/organisation");
  const queryClient = useQueryClient();

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>
          <Plus /> {t("tabs.positions.add.button")}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="p-4">
        <DrawerHeader>
          <DrawerTitle>{t("tabs.positions.add.form.title")}</DrawerTitle>
          <DrawerDescription>
            {t("tabs.positions.add.form.briefDescription")}
          </DrawerDescription>
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
