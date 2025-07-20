// Component Props Types
export interface NextBillingInfoProps {
  currentPlan: string;
  newPlan: string;
  currentPlanInterval?: 'month' | 'year';
  newPlanInterval?: 'month' | 'year';
  nextBillingDate: string;
  nextBillingAmount: number;
  className?: string;
} 