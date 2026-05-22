import {
  AuditInput,
  AuditResult,
  Recommendation,
} from "@/types/audit";

export function generateAudit(
  input: AuditInput
): AuditResult {
  const recommendations: Recommendation[] = [];

  const hasChatGPT = input.tools.some((t) =>
    t.tool.toLowerCase().includes("chatgpt")
  );

  const hasClaude = input.tools.some((t) =>
    t.tool.toLowerCase().includes("claude")
  );

  const hasGemini = input.tools.some((t) =>
    t.tool.toLowerCase().includes("gemini")
  );

  const hasMultipleGeneralTools =
    [hasChatGPT, hasClaude, hasGemini].filter(
      Boolean
    ).length >= 2;

  for (const item of input.tools) {
    let optimizedSpend = item.monthlySpend;

    let action =
      "Current configuration appears optimized.";

    let reason =
      "No significant savings opportunity detected.";

    // TEAM PLAN OVERKILL

    if (
      item.plan.toLowerCase() === "team" &&
      item.seats <= 2
    ) {
      optimizedSpend *= 0.7;

      action = "Downgrade from Team";

      reason =
        "Small teams typically underutilize collaboration and admin features included in Team tiers.";
    }

    // ENTERPRISE OVERKILL

    if (
      item.plan.toLowerCase() ===
        "enterprise" &&
      item.seats < 10
    ) {
      optimizedSpend *= 0.5;

      action = "Move off Enterprise";

      reason =
        "Enterprise pricing is difficult to justify below 10 active seats.";
    }

    // OVERLAPPING GENERAL AI TOOLS

    if (
      hasMultipleGeneralTools &&
      input.useCase === "mixed"
    ) {
      optimizedSpend *= 0.85;

      action =
        "Consolidate overlapping subscriptions";

      reason =
        "Your stack contains overlapping general-purpose AI assistants with similar capabilities.";
    }

    // CODING TOOL OVERLAP

    if (
      input.useCase === "coding" &&
      input.tools.length >= 3
    ) {
      optimizedSpend *= 0.9;

      action =
        "Reduce duplicated coding copilots";

      reason =
        "Engineering teams often oversubscribe to multiple coding assistants with overlapping functionality.";
    }

    // API + SUBSCRIPTION OVERLAP

    const usesAPI =
      input.tools.some((t) =>
        t.tool.toLowerCase().includes("api")
      );

    if (
      usesAPI &&
      (
        item.tool
          .toLowerCase()
          .includes("chatgpt") ||
        item.tool
          .toLowerCase()
          .includes("claude")
      )
    ) {
      optimizedSpend *= 0.9;

      action =
        "Reduce duplicated API + subscription spend";

      reason =
        "Teams using direct APIs often maintain redundant premium subscriptions.";
    }

    // LARGE TEAM OPTIMIZATION

    if (
      input.teamSize >= 20 &&
      item.plan.toLowerCase() === "pro"
    ) {
      optimizedSpend *= 0.8;

      action =
        "Standardize billing across team";

      reason =
        "Larger organizations often reduce costs by consolidating fragmented individual subscriptions.";
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

  const totalCurrentSpend =
    recommendations.reduce(
      (acc, item) =>
        acc + item.currentSpend,
      0
    );

  const totalOptimizedSpend =
    recommendations.reduce(
      (acc, item) =>
        acc + item.optimizedSpend,
      0
    );

  const totalSavings =
    totalCurrentSpend -
    totalOptimizedSpend;

  return {
    recommendations,
    totalCurrentSpend,
    totalOptimizedSpend,
    totalSavings,
    annualSavings: totalSavings * 12,
  };
}