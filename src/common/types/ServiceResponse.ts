export type ServiceResponse<T> = {
  succeeded: boolean;
  message?: string;
  statusCode?: number;
  data?: T;
};
