import { format } from 'date-fns';

export function formatISODateInputDate(isoDate: string) {
  return format(new Date(isoDate), 'yyyy-MM-dd');
}
