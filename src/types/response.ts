export type SuccessResponse<T = any> = {
	success: true;
	message: string;
	details?: T;
};

export type ErrorResponse<T = any> = {
	success: false;
	message: string;
	details: T;
};

export type DefaultErrorResponse = ErrorResponse<{
	error: {
		message: string;
	};
}>;
