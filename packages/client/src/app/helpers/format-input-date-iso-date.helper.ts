export const formatInputDateIsoDate = (inputDate: string): string => {
  return new Date(inputDate + 'T00:00').toISOString();
};
