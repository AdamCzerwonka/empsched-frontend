export enum RoleEnum {
  ADMIN = "ROLE_ADMIN",
  ORGANISATION_ADMIN = "ROLE_ORGANISATION_ADMIN",
  ORGANISATION_EMPLOYEE = "ROLE_ORGANISATION_EMPLOYEE",
}

export type RoleType = keyof typeof RoleEnum;

export const ExtendedRoleEnum = {
  ...RoleEnum,
  AUTHENTICATED: "ROLE_AUTHENTICATED",
} as const;

export type ExtendedRoleType =
  (typeof ExtendedRoleEnum)[keyof typeof ExtendedRoleEnum];
