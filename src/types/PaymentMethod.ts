export interface PaymentMethod {
  id: number;
  accountId: string;
  stripePaymentMethodId: string;
  last4: string | null;
  expirationDate: string | null;
  billingAddress: string | null;
  createdAt: string;
  cardBrand: string | null;
  cardExpMonth: number | null;
  cardExpYear: number | null;
  cardLast4: string | null;
  isDefault: boolean;
  type: string;
  updatedAt: string;
} 