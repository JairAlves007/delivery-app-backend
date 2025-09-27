export type BaseMailData = {
	from: string;
	to: string | string[];
};

export type ResetPasswordMailData = BaseMailData & {
	resetPasswordUrl: string;
	bucketUrl: string;
	supportEmail: string;
	expiresAt: number;
};
