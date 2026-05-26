export type TeamSize = number;

export type UseCase =
  | "Coding"
  | "Writing"
  | "Research"
  | "Data"
  | "Mixed";

export interface ToolConfiguration {
  tool: string;
  plan: string;
  seats: number;
  monthlySpend: number;
}

export interface Recommendation {
  tool: string;
  currentSpend: number;
  optimizedSpend: number;
  savings: number;
  action: string;
  reason: string;
}

export interface AuditResult {
  recommendations: Recommendation[];

  totalCurrentSpend: number;

  totalOptimizedSpend: number;

  totalSavings: number;

  annualSavings: number;

  summary: string;
}