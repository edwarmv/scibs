import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { DbConstraintError } from 'src/errors/db-constraint.error';

@Catch(DbConstraintError)
export class DbConstraintExceptionFilter implements ExceptionFilter {
  catch(exception: DbConstraintError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(409).json({
      statusCode: 409,
      message: exception.message,
      error: 'Conflict',
    });
  }
}
