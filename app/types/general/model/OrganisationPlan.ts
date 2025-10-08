import type { OrganisationPlanEnum } from "../enums/OrganisationPlanEnum";

export interface OrganisationPlan {
  type: OrganisationPlanEnum;
  name: string;
  price: number;
  maxEmployees: number;
  description: string;
}
