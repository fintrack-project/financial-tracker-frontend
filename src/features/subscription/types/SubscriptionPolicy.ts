// Subscription Policy Types
export interface SubscriptionPolicy {
  id: number;
  version: string;
  policyType: 'general' | 'upgrade' | 'downgrade' | 'cancellation';
  content: string; // JSON string containing policy content
  effectiveDate: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyAcceptance {
  id: number;
  accountId: string;
  policyVersion: string;
  policyType: string;
  acceptedAt: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ProrationCalculation {
  id: number;
  calculationHash: string;
  fromPlanId?: string;
  toPlanId?: string;
  daysRemaining?: number;
  prorationAmount: number;
  nextBillingAmount: number;
  calculationDate: string;
  expiresAt: string;
}

export interface SubscriptionChangeAudit {
  id: number;
  accountId: string;
  changeType: 'upgrade' | 'downgrade' | 'cancellation' | 'reactivation';
  fromPlanId?: string;
  toPlanId?: string;
  prorationAmount?: number;
  policyVersion?: string;
  changeDate: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

// API Request/Response Types
export interface PolicyAcceptanceRequest {
  accountId: string;
  policyVersion: string;
  policyType: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ProrationCalculationRequest {
  fromPlanId: string;
  toPlanId: string;
  daysRemaining: number;
  prorationAmount: number;
  nextBillingAmount: number;
}

export interface BillingImpactResponse {
  fromPlanId: string;
  toPlanId: string;
  daysRemaining: number;
  currentAmount: number;
  newAmount: number;
  prorationAmount: number;
  nextBillingAmount: number;
  totalImpact: number;
  savings: number;
}

// Policy Content Structure (parsed from JSON)
export interface PolicyContent {
  title: string;
  sections?: string[];
  content?: string;
  [key: string]: any; // Allow additional properties
}

// Component Props Types
export interface SubscriptionPolicyProps {
  policyType?: 'general' | 'upgrade' | 'downgrade' | 'cancellation';
  onAccept?: (policy: SubscriptionPolicy) => void;
  onDecline?: () => void;
  showAcceptance?: boolean;
  className?: string;
}

export interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: SubscriptionPolicy;
  onAccept?: (policy: SubscriptionPolicy) => void;
  onDecline?: () => void;
}

export interface PolicyAcceptanceProps {
  accountId: string;
  policyType: string;
  policyVersion: string;
  onAccept?: () => void;
  onDecline?: () => void;
  className?: string;
}

export interface ProrationCalculatorProps {
  fromPlanId: string;
  toPlanId: string;
  daysRemaining: number;
  currentAmount: number;
  newAmount: number;
  className?: string;
}

export interface BillingImpactDisplayProps {
  billingImpact: BillingImpactResponse;
  className?: string;
}

export interface NextBillingInfoProps {
  currentPlan: string;
  newPlan: string;
  nextBillingDate: string;
  nextBillingAmount: number;
  className?: string;
} 