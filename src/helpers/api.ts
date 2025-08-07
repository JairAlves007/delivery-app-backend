import { ErrorResponse, SuccessResponse } from "@/types/response";

export class ApiResponse {
	static success<T>(message: string, details?: T): SuccessResponse {
		return {
			success: true,
			message,
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
			message: error.name,
			details
		};
	}
}
