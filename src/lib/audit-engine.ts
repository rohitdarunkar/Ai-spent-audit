import {
  AuditInput,
  AuditResult,
  Recommendation,
} from "@/types/audit";

export function generateAudit(
  input: AuditInput
): AuditResult {
  const recommendations: Recommendation[] = [];

  for (const item of input.tools) {
    let optimizedSpend = item.monthlySpend;

    let action =
      "Current configuration appears optimized.";

    let reason =
      "No significant savings opportunity detected.";

    // Team plan overkill
    if (
      item.plan.toLowerCase() === "team" &&
      item.seats <= 2
    ) {
      optimizedSpend = item.monthlySpend * 0.7;

      action = "Downgrade from Team";

      reason =
        "Small teams rarely utilize advanced collaboration features included in Team tiers.";
    }

    // Enterprise overkill
    if (
      item.plan.toLowerCase() === "enterprise" &&
      item.seats < 10
    ) {
      optimizedSpend = item.monthlySpend * 0.5;

      action = "Move off Enterprise";

      reason =
        "Enterprise pricing is difficult to justify below 10 active seats.";
    }

    // Duplicate tool overlap
    if (
      input.tools.length >= 3 &&
      input.useCase === "mixed"
    ) {
      optimizedSpend *= 0.85;

      action =
        "Consolidate overlapping AI subscriptions";

      reason =
        "Your stack shows functional overlap across multiple general-purpose AI tools.";
    }

    const savings =
      item.monthlySpend - optimizedSpend;

    recommendations.push({
      tool: item.tool,
      currentSpend: item.monthlySpend,
      optimizedSpend,
      savings,
      action,
      reason,
    });
  }

  const totalCurrentSpend = recommendations.reduce(
    (acc, item) => acc + item.currentSpend,
    0
  );

  const totalOptimizedSpend = recommendations.reduce(
    (acc, item) => acc + item.optimizedSpend,
    0
  );

  const totalSavings =
    totalCurrentSpend - totalOptimizedSpend;

  return {
    recommendations,
    totalCurrentSpend,
    totalOptimizedSpend,
    totalSavings,
    annualSavings: totalSavings * 12,
  };
}