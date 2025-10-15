import { useTranslation } from "react-i18next";
import { useEmployees } from "~/api/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui";
import { AddEmployeeDrawer } from "./AddEmployeeDrawer";

export const EmployeesDetails = () => {
  const { employees } = useEmployees();
  const { t } = useTranslation("routes/organisation");

  return (
    <div>
      <section className="mb-4 flex flex-wrap items-center justify-between gap-2 align-middle">
        <h1 className="text-2xl font-bold">{t("tabs.employees.title")}</h1>
        <AddEmployeeDrawer />
      </section>
      <section>
        {employees && employees.length === 0 && (
          <p>{t("tabs.employees.noEmployees")}</p>
        )}
        {employees && employees.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>{t("tabs.employees.table.header.name")}</TableHead>
                <TableHead>{t("tabs.employees.table.header.email")}</TableHead>
                <TableHead>
                  {t("tabs.employees.table.header.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee, index) => (
                <TableRow key={employee.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
};
