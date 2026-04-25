import type { ErrorResponse, SuccessResponse } from "@/types/response.js";

export class ApiResponse {
  static success<T>(message: string, details?: T): SuccessResponse<T> {
    return {
      success: true,
      message,
      details,
    };
  }

  static error(error: Error, details?: unknown): ErrorResponse {
    if (!details) {
      details = {
        error: {
          message: error.message,
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
