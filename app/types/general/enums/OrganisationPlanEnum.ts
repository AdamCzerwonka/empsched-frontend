export enum OrganisationPlanEnum {
  UNIT = "UNIT",
  DEPARTMENT = "DEPARTMENT",
  DIVISION = "DIVISION",
  HEADQUARTERS = "HEADQUARTERS",
}

export type OrganisationPlanType = keyof typeof OrganisationPlanEnum;
