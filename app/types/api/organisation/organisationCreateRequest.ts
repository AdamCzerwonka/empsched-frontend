import type { OrganisationPlan } from "~/types/general";

export interface OrganisationCreateRequest {
  name: string;
  email: string;
  password: string;
  plan: OrganisationPlan;
}
