import { QuoteOrderService } from "@/services/order/quote-order-service.js";

export const makeQuoteOrderService = () => {
  return new QuoteOrderService();
};
