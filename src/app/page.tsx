"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import ToolEntry from "@/components/tool-entry";

import { runAudit } from "@/lib/audit-engine";

import {
  AuditResult,
  TeamSize,
  UseCase,
  ToolConfiguration,
} from "@/types/audit";

export default function HomePage() {
  const router = useRouter();

  const [teamSize, setTeamSize] = useState<TeamSize>(5);

  const [useCase, setUseCase] = useState<UseCase>("Mixed");

  const [tools, setTools] = useState<ToolConfiguration[]>([
    {
      tool: "ChatGPT",
      plan: "Team",
      monthlySpend: 200,
      seats: 5,
    },
    {
      tool: "Claude",
      plan: "Pro",
      monthlySpend: 150,
      seats: 5,
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const totalSpend = useMemo(() => {
    return tools.reduce((acc, tool) => acc + tool.monthlySpend, 0);
  }, [tools]);

  function addTool() {
    setTools((prev) => [
      ...prev,
      {
        tool: "GitHub Copilot",
        plan: "Individual",
        monthlySpend: 20,
        seats: 1,
      },
    ]);
  }

  function removeTool(index: number) {
    setTools((prev) => prev.filter((_, i) => i !== index));
  }

  function updateTool(
    index: number,
    field: keyof ToolConfiguration,
    value: string | number
  ) {
    const updated = [...tools];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setTools(updated);
  }

  async function handleGenerateAudit() {
    try {
      setIsLoading(true);

      const result: AuditResult = await runAudit(
        tools,
        teamSize,
        useCase
      );

      localStorage.setItem("audit-result", JSON.stringify(result));

      router.push("/results");
    } catch (error) {
      console.error("Audit generation failed:", error);

      alert("Failed to generate audit.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-white/70">
            AI Spend Intelligence
          </div>

          <h1 className="mt-6 text-6xl font-bold leading-none tracking-tight">
            Stop Overpaying
            <br />
            <span className="text-zinc-500">for AI Tools</span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400">
            Detect wasted AI spend, redundant subscriptions,
            and overpriced plans.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">
                  AI Stack
                </h2>

                <p className="mt-2 text-zinc-400">
                  Current monthly spend: ${totalSpend}
                </p>
              </div>

              <button
                onClick={addTool}
                className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200"
              >
                Add Tool
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {tools.map((tool, index) => (
                <ToolEntry
                  key={index}
                  tool={tool}
                  index={index}
                  updateTool={updateTool}
                  removeTool={removeTool}
                />
              ))}
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Team Size
                </label>

                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) =>
                    setTeamSize(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Primary Use Case
                </label>

                <select
                  value={useCase}
                  onChange={(e) =>
                    setUseCase(e.target.value as UseCase)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                >
                  <option value="Coding">Coding</option>
                  <option value="Writing">Writing</option>
                  <option value="Research">Research</option>
                  <option value="Data">Data</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateAudit}
              disabled={isLoading}
              className="mt-8 w-full rounded-2xl bg-white px-6 py-4 text-lg font-semibold text-black transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {isLoading
                ? "Generating Audit..."
                : "Generate Audit"}
            </button>
          </div>

          <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-8">
            <p className="text-zinc-500">
              Run an audit to see optimization opportunities.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}