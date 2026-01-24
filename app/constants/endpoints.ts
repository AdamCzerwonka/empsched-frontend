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
    getProfilePicture: "/employees/profile-picture",
    updateProfilePicture: "/employees/profile-picture",
    getEmployees: "/employees",
    getEmployeePositions: "/positions/employees/:employeeId",
    assignPositionToEmployee: "/positions/:positionId/employees/:employeeId",
    getAbsences: "/absences",
    getSelfAbsences: "/absences/self",
    approveAbsence: "/absences/:absenceId/approved",
    createSelfAbsence: "/absences",
    createEmployeeAbsence: "/absences/employees/:employeeId",
    deleteAbsence: "/absences/:absenceId",
  }).map(([key, value]) => [key, `employees${value}`])
);
