import type { OrganisationPlanType } from "~/types/general";

export interface OrganisationCreateRequest {
  name: string;
  email: string;
  password: string;
  plan: OrganisationPlanType;
}
