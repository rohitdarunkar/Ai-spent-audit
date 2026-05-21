export type UseCase =
  | "coding"
  | "writing"
  | "research"
  | "data"
  | "mixed";

export interface ToolEntry {
  id: string;
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
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
}