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

export interface SubscriptionChangeAudit {
  id: number;
  accountId: string;
  changeType: 'upgrade' | 'downgrade' | 'cancellation' | 'reactivation';
  fromPlanId?: string;
  toPlanId?: string;
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

export interface NextBillingInfoProps {
  currentPlan: string;
  newPlan: string;
  nextBillingDate: string;
  nextBillingAmount: number;
  className?: string;
} 