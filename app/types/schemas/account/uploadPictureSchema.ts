import type { TFunction } from "i18next";
import { z } from "zod/v4-mini";
import { accountValidation } from "~/constants";

export const uploadPictureSchema = (t: TFunction) =>
  z.object({
    file: z.any().check(
      z.refine((file) => file instanceof File, {
        message: t("file.required"),
      }),
      z.refine(
        (file) =>
          !file ||
          (file as File).size <= accountValidation.profilePicture.maxSize,
        {
          message: t("file.tooLarge", {
            size: `${accountValidation.profilePicture.maxSize / (1024 * 1024)}MB`,
          }),
        }
      ),
      z.refine(
        (file) =>
          !file ||
          accountValidation.profilePicture.acceptedTypes.includes(
            (file as File).type
          ),
        {
          message: t("file.invalidType"),
        }
      )
    ),
  });

export type uploadPictureSchemaType = z.infer<
  ReturnType<typeof uploadPictureSchema>
>;

export const defaultUploadPictureSchemaValues: uploadPictureSchemaType = {
  file: undefined as any,
};
