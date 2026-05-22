interface Props {
  index: number;
  entry: {
    tool: string;
    plan: string;
    monthlySpend: number;
    seats: number;
  };
  updateEntry: (
    index: number,
    field: string,
    value: string | number
  ) => void;
}

const tools = [
  "Cursor",
  "ChatGPT",
  "Claude",
  "GitHub Copilot",
  "Gemini",
  "OpenAI API",
  "Anthropic API",
];

export default function ToolEntry({
  index,
  entry,
  updateEntry,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="grid gap-4">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Tool
          </label>

          <select
            value={entry.tool}
            onChange={(e) =>
              updateEntry(
                index,
                "tool",
                e.target.value
              )
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Plan
            </label>

            <select
              value={entry.plan}
              onChange={(e) =>
                updateEntry(
                  index,
                  "plan",
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3"
            >
              <option>Free</option>
              <option>Pro</option>
              <option>Team</option>
              <option>Enterprise</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-400">
              Seats
            </label>

            <input
              type="number"
              value={entry.seats}
              onChange={(e) =>
                updateEntry(
                  index,
                  "seats",
                  Number(e.target.value)
                )
              }
              className="w-full rounded-xl border border-white/10 bg-black px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Monthly Spend
          </label>

          <input
            type="number"
            value={entry.monthlySpend}
            onChange={(e) =>
              updateEntry(
                index,
                "monthlySpend",
                Number(e.target.value)
              )
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3"
          />
        </div>
      </div>
    </div>
  );
}