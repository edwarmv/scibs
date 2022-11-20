import { format } from 'date-fns';

export function inputDateIsoFormat(inputDate: string) {
  return format(new Date(inputDate), 'yyyy-MM-dd');
}
