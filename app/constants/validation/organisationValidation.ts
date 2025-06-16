import { minLength } from "zod/v4-mini";

export const organisationValidation = {
  name: {
    minLength: 3,
    maxLength: 50,
  },
  maxEmployees: {
    min: 1,
    max: 1000,
  },
};
