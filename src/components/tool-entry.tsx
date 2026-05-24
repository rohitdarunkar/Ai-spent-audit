"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

export interface ToolConfiguration {
  tool: string;
  plan: string;
  seats: number;
  monthlySpend: number;
}

interface Props {
  tool: ToolConfiguration;

  index: number;

  updateTool: (
    index: number,
    field: keyof ToolConfiguration,
    value: string | number
  ) => void;

  removeTool: (index: number) => void;
}

const toolOptions = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "GitHub Copilot",
  "Cursor",
  "Perplexity",
];

const plans = [
  "Free",
  "Plus",
  "Pro",
  "Team",
  "Enterprise",
  "Individual",
];

export default function ToolEntry({
  tool,
  index,
  updateTool,
  removeTool,
}: Props) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <div className="mb-4 flex items-center justify-between">
        <label className="text-sm text-zinc-400">
          Tool
        </label>

        <button
          onClick={() =>
            removeTool(index)
          }
          className="text-sm text-red-500"
        >
          Remove
        </button>
      </div>

      <Select
        value={tool.tool}
        onValueChange={(value) =>
          updateTool(
            index,
            "tool",
            value
          )
        }
      >
        <SelectTrigger className="bg-black">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {toolOptions.map((item) => (
            <SelectItem
              key={item}
              value={item}
            >
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Plan
          </label>

          <Select
            value={tool.plan}
            onValueChange={(value) =>
              updateTool(
                index,
                "plan",
                value
              )
            }
          >
            <SelectTrigger className="bg-black">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {plans.map((plan) => (
                <SelectItem
                  key={plan}
                  value={plan}
                >
                  {plan}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">
            Seats
          </label>

          <Input
            type="number"
            value={tool.seats}
            onChange={(e) =>
              updateTool(
                index,
                "seats",
                Number(
                  e.target.value
                )
              )
            }
            className="bg-black"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm text-zinc-400">
          Monthly Spend
        </label>

        <Input
          type="number"
          value={tool.monthlySpend}
          onChange={(e) =>
            updateTool(
              index,
              "monthlySpend",
              Number(
                e.target.value
              )
            )
          }
          className="bg-black"
        />
      </div>
    </div>
  );
}