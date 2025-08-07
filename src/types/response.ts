export type SuccessResponse<T = any> = {
	success: true;
	message: string;
	details?: T;
};

export type ErrorResponse = {
	success: false;
	message: string;
	details: any;
};
