import type { TFunction } from "i18next";
import { z } from "zod/v4-mini";
import { positionSchema } from "..";

export const positionCreateSchema = (t: TFunction) => {
  return z.pick(positionSchema(t), {
    name: true,
    description: true,
  });
};
export type positionCreateSchemaType = z.infer<
  ReturnType<typeof positionCreateSchema>
>;

export const defaultPositionCreateSchemaValues: positionCreateSchemaType = {
  name: "",
  description: "",
};
