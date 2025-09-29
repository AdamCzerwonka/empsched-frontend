export const authEndpoints = Object.fromEntries(
  Object.entries({
    signIn: "/login",
  }).map(([key, value]) => [key, `auth${value}`])
);

export const organisationEndpoints = Object.fromEntries(
  Object.entries({}).map(([key, value]) => [key, `organisations${value}`])
);

export const workflowEndpoints = Object.fromEntries(
  Object.entries({
    create: "/organisations",
  }).map(([key, value]) => [key, `workflow${value}`])
);
