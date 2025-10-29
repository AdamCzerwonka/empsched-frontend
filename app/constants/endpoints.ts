export const authEndpoints = Object.fromEntries(
  Object.entries({
    signIn: "/login",
  }).map(([key, value]) => [key, `auth${value}`])
);

export const organisationEndpoints = Object.fromEntries(
  Object.entries({
    createOrganisation: "/organisations",
    getOrganisation: "/organisations",
    createPosition: "/positions",
    getPositions: "/positions",
  }).map(([key, value]) => [key, `organisations${value}`])
);

export const employeeEndpoints = Object.fromEntries(
  Object.entries({
    createEmployee: "/employees",
    getEmployees: "/employees",
    getEmployeePositions: "/positions/employees/:employeeId",
    assignPositionToEmployee: "/positions/:positionId/employees/:employeeId",
    createSelfAbsence: "/absences",
    createEmployeeAbsence: "/absences/employees/:employeeId",
  }).map(([key, value]) => [key, `employees${value}`])
);
