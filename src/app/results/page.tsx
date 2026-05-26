"use client";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import jsPDF from "jspdf";

import html2canvas from "html2canvas";

import { AuditResult } from "@/types/audit";

export default function ResultsPage() {
  const [result, setResult] =
    useState<AuditResult | null>(null);

  const [summary, setSummary] =
    useState("");

  const reportRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved =
      localStorage.getItem("audit-result");

    if (saved) {
      const parsed = JSON.parse(saved);

      setResult(parsed);

      fetch("/api/generate-summary", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(parsed),
      })
        .then((res) => res.json())
        .then((data) => {
          setSummary(data.summary);
        });
    }
  }, []);

  async function downloadPDF() {
    if (!reportRef.current) return;

    const canvas =
      await html2canvas(
        reportRef.current
      );

    const imgData =
      canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const width =
      pdf.internal.pageSize.getWidth();

    const height =
      (canvas.height * width) /
      canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      width,
      height
    );

    pdf.save(
      "ai-spend-audit-report.pdf"
    );
  }

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading audit results...
      </main>
    );
  }

  const highSavings =
    result.totalSavings >= 500;

  const chartData =
    result.recommendations.map(
      (rec) => ({
        name: rec.tool,

        Current:
          rec.currentSpend,

        Optimized:
          rec.optimizedSpend,
      })
    );

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div
          ref={reportRef}
          className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-10"
        >
          {/* HEADER */}

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
                monthly optimization
                potential
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-4">
                <p className="text-sm text-emerald-400">
                  Annual Savings
                </p>

                <h2 className="mt-2 text-4xl font-bold text-white">
                  $
                  {Math.round(
                    result.totalSavings *
                      12
                  )}
                </h2>
              </div>

              <button
                onClick={downloadPDF}
                className="rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-zinc-200"
              >
                Download PDF Report
              </button>
            </div>
          </div>

          {/* AI SUMMARY */}

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-xl font-semibold">
              AI Executive Summary
            </h3>

            <p className="mt-4 whitespace-pre-line leading-7 text-zinc-300">
              {summary ||
                result.summary ||
                "Generating AI summary..."}
            </p>
          </div>

          {/* CHART */}

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold">
                Spend Optimization
                Analysis
              </h3>

              <p className="mt-2 text-zinc-400">
                Compare current AI spend
                versus optimized
                recommendations.
              </p>
            </div>

            <div className="h-[320px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={chartData}
                >
                  <XAxis
                    dataKey="name"
                  />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="Current"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  />

                  <Bar
                    dataKey="Optimized"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RECOMMENDATIONS */}

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

          {/* CTA */}

          <div className="mt-10 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6">
            {highSavings ? (
              <div>
                <h3 className="text-2xl font-semibold text-indigo-300">
                  Significant Savings
                  Opportunity
                </h3>

                <p className="mt-3 max-w-2xl text-indigo-200/80">
                  Your stack shows
                  meaningful AI
                  overspend. Credex can
                  help optimize vendor
                  contracts and
                  infrastructure spend.
                </p>

                <button className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-black">
                  Book Credex
                  Consultation
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-semibold text-indigo-300">
                  Your Spend Looks
                  Healthy
                </h3>

                <p className="mt-3 text-indigo-200/80">
                  No major overspend
                  detected.
                </p>

                <button className="mt-6 rounded-xl border border-white/10 px-6 py-3">
                  Notify Me About Future
                  Optimizations
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}