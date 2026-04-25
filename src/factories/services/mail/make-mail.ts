import { Mail } from "@/classes/mail.js";

export const makeMail = () => {
  return Mail.getInstance();
};
