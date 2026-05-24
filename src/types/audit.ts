export type UseCase =
  | "Coding"
  | "Writing"
  | "Research"
  | "Data"
  | "Mixed";

export type TeamSize = number;

export interface ToolConfiguration {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface Recommendation {
  tool: string;
  currentSpend: number;
  optimizedSpend: number;
  savings: number;
  action: string;
  reasoning: string;
}

export interface AuditResult {
  totalCurrentSpend: number;
  totalOptimizedSpend: number;
  totalSavings: number;
  recommendations: Recommendation[];
  summary: string;
}