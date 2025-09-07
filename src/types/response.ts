export type SuccessResponse<T = any> = {
	success: true;
	code: string;
	details?: T;
};

export type ErrorResponse<T = any> = {
	success: false;
	code: string;
	details: T;
};

export type DefaultErrorResponse = ErrorResponse<{
	error: {
		message: string;
	};
}>;
