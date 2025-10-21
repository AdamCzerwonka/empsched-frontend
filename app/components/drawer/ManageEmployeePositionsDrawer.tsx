import { useTranslation } from "react-i18next";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "../ui";
import { BetweenHorizontalStart } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useAssignEmployeePosition,
  useEmployeePositions,
  usePositions,
  useRemoveEmployeePosition,
} from "~/api/hooks";
import { DisplayData } from "../system";
import { baseFormSuccessHandler } from "~/lib";

interface Props {
  employeeId: string;
  renderTrigger?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export const ManageEmployeePositionsDrawer = ({
  employeeId,
  open,
  setOpen,
  renderTrigger = true,
}: Props) => {
  const { positions, isPending } = usePositions();
  const { employeePositions, isPending: isPendingEmployeePositions } =
    useEmployeePositions(employeeId);
  const { assignEmployeePositionAsync, isPending: isPendingAssign } =
    useAssignEmployeePosition();
  const { removeEmployeePositionAsync, isPending: isPendingRemove } =
    useRemoveEmployeePosition();
  const [currentEmployeePositions, setCurrentEmployeePositions] = useState<
    typeof positions
  >(employeePositions || []);

  const { t } = useTranslation(
    "components/drawer/manageEmployeePositionsDrawer"
  );
  const { t: tInfo } = useTranslation("information");
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    if (employeePositions) {
      setCurrentEmployeePositions(employeePositions);
    }
  }, [employeePositions]);

  const handleAddPosition = (positionId: string) => {
    assignEmployeePositionAsync(
      { positionId, employeeId },
      {
        onSuccess: (data) => {
          baseFormSuccessHandler(
            null,
            false,
            true,
            tInfo("positions.positionAssigned"),
            () => setCurrentEmployeePositions(data)
          );
        },
      }
    );
  };

  const handleRemovePosition = (positionId: string) => {
    removeEmployeePositionAsync(
      { positionId, employeeId },
      {
        onSuccess: (data) => {
          baseFormSuccessHandler(
            null,
            false,
            true,
            tInfo("positions.positionRemoved"),
            () => setCurrentEmployeePositions(data)
          );
        },
      }
    );
  };

  const isPositionAssigned = (positionId: string) => {
    return currentEmployeePositions?.some((pos) => pos.id === positionId);
  };

  const emptyContent = <p>{t("noPositions")}</p>;

  const dataContent = (data: typeof positions) => (
    <section className="grid min-w-1/3 gap-2">
      <Table>
        <TableBody>
          {data?.map((position) => (
            <TableRow key={position.id}>
              <TableCell>{position.name}</TableCell>
              <TableCell className="flex items-center justify-end">
                {(isPendingAssign || isPendingRemove) && (
                  <Spinner className="mr-2" />
                )}
                {isPositionAssigned(position.id) && (
                  <span className="text-muted-foreground mr-2 text-xs uppercase">
                    {t("assigned")}
                  </span>
                )}
                <Switch
                  checked={isPositionAssigned(position.id)}
                  disabled={
                    isPendingAssign ||
                    isPendingRemove ||
                    isPendingEmployeePositions
                  }
                  onCheckedChange={(val) => {
                    if (val) {
                      handleAddPosition(position.id);
                    } else {
                      handleRemovePosition(position.id);
                    }
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );

  return (
    <Drawer open={open ?? openDrawer} onOpenChange={setOpen ?? setOpenDrawer}>
      {renderTrigger && (
        <DrawerTrigger asChild>
          <Button>
            <BetweenHorizontalStart className="text-primary-foreground" />{" "}
            {t("triggerButton")}
          </Button>
        </DrawerTrigger>
      )}

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("header.title")}</DrawerTitle>
          <DrawerDescription>{t("header.briefDescription")}</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col items-center justify-center">
          <DisplayData
            isLoading={isPending || isPendingEmployeePositions}
            data={positions}
            emptyContent={emptyContent}
            dataContent={dataContent}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
