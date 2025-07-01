export interface PaymentMethod {
  id: number;
  accountId: string;
  stripePaymentMethodId: string;
  last4: string | null;
  expirationDate: string | null;
  billingAddress: string | null;
  createdAt: string;
  cardBrand: string | null;
  cardExpMonth: string | null;
  cardExpYear: string | null;
  cardLast4: string | null;
  default: boolean;
  type: string;
  updatedAt: string;
}

export interface StripePaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface ErrorResponse {
  type: 'payment_error' | 'internal_error';
  message: string;
  code: string | null;
}

export class PaymentError extends Error {
  type: string;
  code: string | null;

  constructor(type: string, message: string, code: string | null) {
    super(message);
    this.type = type;
    this.code = code;
    this.name = 'PaymentError';
  }
}