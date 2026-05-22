"use client";

import { useEffect, useState } from "react";

import { AuditResult } from "@/types/audit";

export default function ResultsPage() {
  const [result, setResult] =
    useState<AuditResult | null>(null);

  useEffect(() => {
    const saved =
      localStorage.getItem("audit-result");

    if (saved) {
      setResult(JSON.parse(saved));
    }
  }, []);

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        No audit results found.
      </main>
    );
  }

  const highSavings =
    result.totalSavings >= 500;

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-zinc-400">
                Estimated Savings
              </p>

              <h1 className="mt-3 text-7xl font-bold">
                $
                {Math.round(
                  result.totalSavings
                )}
              </h1>

              <p className="mt-3 text-zinc-500">
                monthly optimization potential
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-4">
              <p className="text-sm text-emerald-400">
                Annual Savings
              </p>

              <h2 className="mt-2 text-4xl font-bold text-white">
                $
                {Math.round(
                  result.annualSavings
                )}
              </h2>
            </div>
          </div>

          <div className="mt-12 grid gap-5">
            {result.recommendations.map(
              (rec) => (
                <div
                  key={rec.tool}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">
                        {rec.tool}
                      </h3>

                      <p className="mt-2 text-zinc-300">
                        {rec.action}
                      </p>

                      <p className="mt-3 max-w-2xl text-sm text-zinc-500">
                        {rec.reason}
                      </p>
                    </div>

                    <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-400">
                      Save $
                      {Math.round(
                        rec.savings
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-10 text-sm">
                    <div>
                      <p className="text-zinc-500">
                        Current
                      </p>

                      <p className="mt-1 text-xl font-semibold">
                        $
                        {Math.round(
                          rec.currentSpend
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-zinc-500">
                        Optimized
                      </p>

                      <p className="mt-1 text-xl font-semibold">
                        $
                        {Math.round(
                          rec.optimizedSpend
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="mt-10 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6">
            {highSavings ? (
              <div>
                <h3 className="text-2xl font-semibold text-indigo-300">
                  Significant Savings Opportunity
                </h3>

                <p className="mt-3 max-w-2xl text-indigo-200/80">
                  Your stack shows meaningful AI
                  overspend. Credex can help reduce
                  costs further through discounted AI
                  infrastructure credits and vendor
                  optimization.
                </p>

                <button className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-black">
                  Book Credex Consultation
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold text-indigo-300">
                  Your Spend Looks Healthy
                </h3>

                <p className="mt-3 text-indigo-200/80">
                  We didn’t detect major overspend in
                  your current stack. That’s a good
                  thing.
                </p>

                <button className="mt-6 rounded-xl border border-white/10 px-6 py-3">
                  Notify Me About Future Optimizations
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}