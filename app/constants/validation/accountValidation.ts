export const accountValidation = {
  firstName: {
    minLength: 1,
    maxLength: 50,
  },
  lastName: {
    minLength: 1,
    maxLength: 50,
  },
  phoneNumber: {
    minLength: 5,
    maxLength: 15,
  },
  password: {
    minLength: 8,
    maxLength: 64,
  },
  mail: {
    minLength: 5,
    maxLength: 100,
  },
  profilePicture: {
    maxSize:
      Number(import.meta.env.VITE_MAX_PROFILE_PICTURE_SIZE_MB) * 1024 * 1024,
    acceptedTypes: [
      "image/jpeg",
      "image/png",
      "image/bmp",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ],
  },
};
