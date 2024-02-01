import { FieldError } from "../graphql/generated/graphql";

export const errorArrayToMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {};

  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });

  return errorMap;
};
