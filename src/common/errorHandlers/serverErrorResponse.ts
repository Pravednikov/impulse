import { HttpException, HttpStatus } from '@nestjs/common';
import { ServiceResponse } from 'common/types/ServiceResponse';

export const serverErrorResponse = (
  error: unknown,
  statusCode: HttpStatus,
): ServiceResponse<any> => ({
  succeeded: false,
  message: (error as Error).message,
  statusCode,
});

export class ServerHttpErrorResponse extends HttpException {
  constructor(response: ServiceResponse<any>) {
    super(
      response.message,
      response.statusCode
        ? response.statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
