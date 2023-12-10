import { ServiceResponse } from 'common/types/ServiceResponse';

export const serverErrorResponse = (error: unknown): ServiceResponse<any> => ({
  succeeded: false,
  message: (error as Error).message,
});
