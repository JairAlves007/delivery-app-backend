import type {
  DefaultErrorResponse,
  ErrorResponse,
  SuccessResponse,
} from "@/types/response.js";

export class ApiResponse {
  static success<T>(message: string, details?: T): SuccessResponse<T> {
    return {
      success: true,
      message,
      details,
    };
  }

  static error(error: Error): DefaultErrorResponse;
  static error<T>(error: Error, details: T): ErrorResponse<T>;
  static error<T>(
    error: Error,
    details?: T,
  ): ErrorResponse<T> | DefaultErrorResponse {
    if (details === undefined) {
      return {
        success: false,
        code: error.name,
        details: {
          error: {
            message: error.message,
          },
        },
      };
    }

    return {
      success: false,
      code: error.name,
      details,
    };
  }
}
