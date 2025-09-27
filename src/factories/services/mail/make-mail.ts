import { Mail } from "@/classes/mail.ts";

export const makeMail = () => {
	return Mail.getInstance();
};
