import type { ErrorResponse, SuccessResponse } from "@/types/response.ts";

export class ApiResponse {
	static success<T>(code: string, details?: T): SuccessResponse {
		return {
			success: true,
			code,
			details
		};
	}

	static error(error: Error, details?: any): ErrorResponse {
		if (!details) {
			details = {
				error: {
					message: error.message
				}
			};
		}

		return {
			success: false,
			code: error.name,
			details
		};
	}
}
