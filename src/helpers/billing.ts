import Constants from "@/helpers/constants.js";

export const getBillingGraceCutoff = (): Date => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - Constants.BILLING_GRACE_PERIOD_DAYS);

  return cutoff;
};
