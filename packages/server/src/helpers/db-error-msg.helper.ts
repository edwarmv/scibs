import { DbConstraintError } from 'src/errors/db-constraint.error';

export const getDbErrorMsgFields = (
  message: string,
  entityName: string
): string[] => {
  if (message === 'SQLITE_CONSTRAINT: FOREIGN KEY constraint failed') {
    throw new DbConstraintError('FOREIGN KEY constraint failed');
  }

  const regex = new RegExp(`\(?:${entityName}\\.\)\(\\w+\)`, 'g');
  let res: RegExpExecArray;
  const fields: string[] = [];
  do {
    res = regex.exec(message);
    if (res) {
      fields.push(res[1]);
    }
  } while (res);
  return fields;
};
