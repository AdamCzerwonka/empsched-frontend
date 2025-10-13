export const authEndpoints = Object.fromEntries(
  Object.entries({
    signIn: "/login",
  }).map(([key, value]) => [key, `auth${value}`])
);

export const organisationEndpoints = Object.fromEntries(
  Object.entries({
    getOrganisation: "/",
    getPositions: "/positions",
  }).map(([key, value]) => [key, `organisation${value}`])
);

export const employeeEndpoints = Object.fromEntries(
  Object.entries({
    getEmployees: "/",
  }).map(([key, value]) => [key, `employees${value}`])
);

export const workflowEndpoints = Object.fromEntries(
  Object.entries({
    createOrganisation: "/organisations",
    createPosition: "/positions",
    createEmployee: "/employees",
  }).map(([key, value]) => [key, `workflow${value}`])
);
