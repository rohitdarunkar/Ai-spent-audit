"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

import ToolEntry from "@/components/tool-entry";

import { generateAudit } from "@/lib/audit-engine";

import {
  AuditResult,
  ToolEntry as ToolEntryType,
  UseCase,
} from "@/types/audit";

export default function HomePage() {
  const [tools, setTools] = useState<
    ToolEntryType[]
  >([
    {
      id: uuidv4(),
      tool: "ChatGPT",
      plan: "Team",
      monthlySpend: 120,
      seats: 3,
    },
  ]);

  const [teamSize, setTeamSize] =
    useState(5);

  const [useCase, setUseCase] =
    useState<UseCase>("mixed");

  const [result, setResult] =
    useState<AuditResult | null>(null);

  // LOAD LOCAL STORAGE

  useEffect(() => {
    const saved = localStorage.getItem(
      "ai-spend-audit"
    );

    if (saved) {
      const parsed = JSON.parse(saved);

      setTools(parsed.tools);
      setTeamSize(parsed.teamSize);
      setUseCase(parsed.useCase);
    }
  }, []);

  // SAVE LOCAL STORAGE

  useEffect(() => {
    localStorage.setItem(
      "ai-spend-audit",
      JSON.stringify({
        tools,
        teamSize,
        useCase,
      })
    );
  }, [tools, teamSize, useCase]);

  function updateEntry(
    index: number,
    field: string,
    value: string | number
  ) {
    const updated = [...tools];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setTools(updated);
  }

  function addTool() {
    setTools([
      ...tools,
      {
        id: uuidv4(),
        tool: "Claude",
        plan: "Pro",
        monthlySpend: 20,
        seats: 1,
      },
    ]);
  }

  function removeTool(id: string) {
    setTools(
      tools.filter((tool) => tool.id !== id)
    );
  }

  function runAudit() {
    const audit = generateAudit({
      tools,
      teamSize,
      useCase,
    });

    setResult(audit);

    localStorage.setItem(
      "audit-result",
      JSON.stringify(audit)
    );

    window.location.href = "/results";
  }

  const totalSpend = useMemo(() => {
    return tools.reduce(
      (acc, item) =>
        acc + item.monthlySpend,
      0
    );
  }, [tools]);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm text-zinc-300">
            AI Spend Intelligence
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Stop Overpaying
            <span className="block text-zinc-500">
              for AI Tools
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Detect wasted AI spend, redundant
            subscriptions, and overpriced plans.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* LEFT PANEL */}

          <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">
                  AI Stack
                </h2>

                <p className="mt-2 text-zinc-400">
                  Current monthly spend: $
                  {totalSpend}
                </p>
              </div>

              <button
                onClick={addTool}
                className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
              >
                Add Tool
              </button>
            </div>

            <div className="mt-8 space-y-5">
              {tools.map((entry, index) => (
                <div
                  key={entry.id}
                  className="relative"
                >
                  <ToolEntry
                    index={index}
                    entry={entry}
                    updateEntry={updateEntry}
                  />

                  {tools.length > 1 && (
                    <button
                      onClick={() =>
                        removeTool(entry.id)
                      }
                      className="absolute right-3 top-3 text-sm text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>
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
                    setTeamSize(
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Primary Use Case
                </label>

                <select
                  value={useCase}
                  onChange={(e) =>
                    setUseCase(
                      e.target
                        .value as UseCase
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3"
                >
                  <option value="coding">
                    Coding
                  </option>

                  <option value="writing">
                    Writing
                  </option>

                  <option value="research">
                    Research
                  </option>

                  <option value="data">
                    Data
                  </option>

                  <option value="mixed">
                    Mixed
                  </option>
                </select>
              </div>
            </div>

            <button
              onClick={runAudit}
              className="mt-8 w-full rounded-2xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-zinc-200"
            >
              Generate Audit
            </button>
          </div>

          {/* RIGHT PANEL */}

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-8">
            {!result ? (
              <div className="flex h-full items-center justify-center text-zinc-500">
                Run an audit to see optimization
                opportunities.
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-zinc-400">
                      Monthly Savings
                    </p>

                    <h2 className="mt-2 text-6xl font-bold">
                      $
                      {Math.round(
                        result.totalSavings
                      )}
                    </h2>

                    <p className="mt-2 text-zinc-500">
                      per month
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
                    Audit Complete
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  {result.recommendations.map(
                    (rec) => (
                      <div
                        key={rec.tool}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">
                            {rec.tool}
                          </h3>

                          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                            Save $
                            {Math.round(
                              rec.savings
                            )}
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-zinc-300">
                          {rec.action}
                        </p>

                        <p className="mt-2 text-sm text-zinc-500">
                          {rec.reason}
                        </p>
                      </div>
                    )
                  )}

                  <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
                    <h3 className="font-semibold text-indigo-300">
                      Annual Savings Potential
                    </h3>

                    <p className="mt-4 text-5xl font-bold">
                      $
                      {Math.round(
                        result.annualSavings
                      )}
                    </p>

                    <p className="mt-2 text-indigo-200/70">
                      projected yearly reduction
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}