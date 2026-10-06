export interface CalculatorMetadata {
  id: string;
  slug: string;
  name: string;
  description: string;

  version: string;

  applicableYear?: number;

  lastReviewedAt?: string;
}

export interface CalculatorResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}