import type { OrganisationPlanType } from "../enums/OrganisationPlanEnum";

export interface Organisation {
  id: string;
  name: string;
  ownerId: string;
  plan: OrganisationPlanType;
}
