import { OrganisationPlanEnum, type OrganisationPlan } from "../types/general";

export const OrganisationPlans: OrganisationPlan[] = [
  {
    type: OrganisationPlanEnum.UNIT,
    name: "plans.unit.name",
    price: 50,
    maxEmployees: 25,
    description: "plans.unit.description",
  },
  {
    type: OrganisationPlanEnum.DEPARTMENT,
    name: "plans.department.name",
    price: 100,
    maxEmployees: 100,
    description: "plans.department.description",
  },
  {
    type: OrganisationPlanEnum.DIVISION,
    name: "plans.division.name",
    price: 250,
    maxEmployees: 500,
    description: "plans.division.description",
  },
  {
    type: OrganisationPlanEnum.HEADQUARTERS,
    name: "plans.headquarters.name",
    price: 400,
    maxEmployees: 1000,
    description: "plans.headquarters.description",
  },
];
