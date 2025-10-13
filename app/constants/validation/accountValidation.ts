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
};
