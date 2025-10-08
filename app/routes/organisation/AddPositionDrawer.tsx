import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CustomFormField, CustomFormTextarea } from "~/components/form";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Form,
  LoadingButton,
} from "~/components/ui";
import {
  defaultPositionCreateSchemaValues,
  positionCreateSchema,
  type positionCreateSchemaType,
} from "~/types/schemas";
import { useCreatePosition } from "~/api/hooks";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const AddPositionDrawer = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation("routes/organisation");
  const { t: tVal } = useTranslation("validation");
  const { t: tCommon } = useTranslation("common");
  const { createPositionAsync, isPending } = useCreatePosition();
  const queryClient = useQueryClient();

  const form = useForm<positionCreateSchemaType>({
    resolver: zodResolver(positionCreateSchema(tVal)),
    defaultValues: defaultPositionCreateSchemaValues,
  });

  const handleSubmit = async (values: positionCreateSchemaType) => {
    const response = await createPositionAsync(values, {
      onSuccess: () => {
        toast.success(t("tabs.positions.add.toast.success"));
        queryClient.invalidateQueries({ queryKey: ["positions"] });
        form.reset();
        setOpen(false);
      },
    });
  };

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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="mx-auto my-8 flex w-full max-w-sm flex-col gap-4"
          >
            <CustomFormField
              name="name"
              label={t("tabs.positions.add.form.name.label")}
              placeholder={t("tabs.positions.add.form.name.placeholder")}
              type="text"
            />
            <CustomFormTextarea
              name="description"
              label={t("tabs.positions.add.form.description.label")}
              placeholder={t("tabs.positions.add.form.description.placeholder")}
              type="text"
            />
            <LoadingButton
              className="mt-4 w-full"
              type="submit"
              isLoading={isPending}
            >
              {tCommon("submit")}
            </LoadingButton>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};
