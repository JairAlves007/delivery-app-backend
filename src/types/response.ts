export type SuccessResponse<T = unknown> = {
  success: true;
  message: string;
  details?: T;
};

export type ErrorResponse<T = unknown> = {
  success: false;
  code: string;
  details: T;
};

export type DefaultErrorResponse = ErrorResponse<{
  error: {
    message: string;
  };
}>;
