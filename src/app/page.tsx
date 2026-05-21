"use client";

import { useMemo, useState } from "react";

const tools = [
  "Cursor",
  "ChatGPT",
  "Claude",
  "GitHub Copilot",
  "Gemini",
  "OpenAI API",
  "Anthropic API",
];

export default function HomePage() {
  const [selectedTool, setSelectedTool] =
    useState("ChatGPT");

  const [plan, setPlan] = useState("Team");

  const [monthlySpend, setMonthlySpend] =
    useState(120);

  const [seats, setSeats] = useState(3);

  const savings = useMemo(() => {
    if (plan === "Team" && seats <= 2) {
      return Math.round(monthlySpend * 0.3);
    }

    if (plan === "Enterprise" && seats < 10) {
      return Math.round(monthlySpend * 0.5);
    }

    return 0;
  }, [plan, monthlySpend, seats]);

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
            Audit your AI stack in under 60 seconds.
            Detect waste, downgrade overpriced plans,
            and uncover hidden savings opportunities.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* LEFT PANEL */}

          <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8">
            <h2 className="text-2xl font-semibold">
              AI Spend Audit
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Enter your current AI subscriptions.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Tool
                </label>

                <select
                  value={selectedTool}
                  onChange={(e) =>
                    setSelectedTool(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                >
                  {tools.map((tool) => (
                    <option
                      key={tool}
                      value={tool}
                    >
                      {tool}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Plan
                </label>

                <select
                  value={plan}
                  onChange={(e) =>
                    setPlan(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                >
                  <option>Free</option>
                  <option>Pro</option>
                  <option>Team</option>
                  <option>Enterprise</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Monthly Spend ($)
                </label>

                <input
                  type="number"
                  value={monthlySpend}
                  onChange={(e) =>
                    setMonthlySpend(
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-zinc-300">
                  Seats
                </label>

                <input
                  type="number"
                  value={seats}
                  onChange={(e) =>
                    setSeats(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                />
              </div>

              <button className="w-full rounded-xl bg-white px-6 py-4 font-semibold text-black transition hover:bg-zinc-200">
                Generate Audit
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-400">
                  Estimated Savings
                </p>

                <h2 className="mt-2 text-6xl font-bold">
                  ${savings}
                </h2>

                <p className="mt-2 text-zinc-500">
                  per month
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
                Optimization Found
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {selectedTool}
                  </h3>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                    Save ${savings}
                  </span>
                </div>

                <p className="mt-3 text-zinc-400">
                  {plan === "Team" && seats <= 2
                    ? "Your team is likely overpaying for collaboration features that are underutilized."
                    : plan === "Enterprise" &&
                      seats < 10
                    ? "Enterprise pricing is likely excessive for your current scale."
                    : "Your current plan appears reasonably optimized."}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold">
                  Annual Savings Potential
                </h3>

                <p className="mt-4 text-4xl font-bold">
                  ${savings * 12}
                </p>

                <p className="mt-2 text-zinc-500">
                  projected yearly reduction
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
                <h3 className="font-semibold text-indigo-300">
                  Credex Optimization
                </h3>

                <p className="mt-3 text-indigo-200/80">
                  Companies with high AI spend can
                  reduce costs further through discounted
                  infrastructure credits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}