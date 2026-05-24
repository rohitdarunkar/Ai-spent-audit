import {
  ToolConfiguration,
  AuditResult,
  Recommendation,
  UseCase,
} from "@/types/audit";

export function runAudit(
  tools: ToolConfiguration[],
  teamSize: number,
  useCase: UseCase
): AuditResult {
  const recommendations: Recommendation[] = [];

  let totalSavings = 0;

  for (const tool of tools) {
    let optimizedSpend = tool.monthlySpend;

    let action =
      "Current configuration appears optimized.";

    let reasoning =
      "No significant savings opportunity detected.";

    // DUPLICATE TOOL CHECK

    const duplicateTools = tools.filter(
      (t) => t.tool !== tool.tool
    );

    if (
      duplicateTools.length >= 1 &&
      useCase === "Coding"
    ) {
      optimizedSpend =
        tool.monthlySpend * 0.7;

      action =
        "Consolidate overlapping AI tooling.";

      reasoning =
        "Multiple coding assistants detected. Teams often reduce costs by standardizing on one platform.";
    }

    // TEAM PLAN OVERSIZED

    else if (
      tool.plan === "Team" &&
      tool.seats <= 5
    ) {
      optimizedSpend =
        tool.monthlySpend * 0.6;

      action =
        "Downgrade from Team plan.";

      reasoning =
        "Smaller teams may not fully utilize enterprise collaboration features.";
    }

    // HIGH SPEND DETECTION

    else if (
      tool.monthlySpend >= 150
    ) {
      optimizedSpend =
        tool.monthlySpend * 0.75;

      action =
        "Negotiate enterprise pricing.";

      reasoning =
        "High monthly spend suggests potential vendor discount opportunities.";
    }

    const savings =
      tool.monthlySpend -
      optimizedSpend;

    totalSavings += savings;

    recommendations.push({
      tool: tool.tool,

      currentSpend:
        tool.monthlySpend,

      optimizedSpend,

      savings,

      action,

      reasoning,
    });
  }

  return {
    totalCurrentSpend: tools.reduce(
      (acc, tool) =>
        acc + tool.monthlySpend,
      0
    ),

    totalOptimizedSpend:
      tools.reduce(
        (acc, tool) =>
          acc + tool.monthlySpend,
        0
      ) - totalSavings,

    totalSavings,

    recommendations,

    summary:
      totalSavings > 200
        ? "Your AI stack shows meaningful optimization opportunities."
        : "Your AI stack appears reasonably optimized with limited overspend opportunities detected.",
  };
}