"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  DcaPoint,
  PortfolioAllocationResult,
  ProjectionPoint,
  ScenarioRow
} from "@/lib/types";
import { formatCompactCurrency, formatPercent } from "@/lib/utils";

function ChartShell(props: { children: ReactNode }) {
  return <div className="h-[260px] w-full">{props.children}</div>;
}

function TooltipCard(props: {
  label?: string;
  lines: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0a1015]/95 px-4 py-3 text-sm text-ink shadow-2xl backdrop-blur">
      {props.label ? <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted">{props.label}</p> : null}
      <div className="space-y-1">
        {props.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export function ProjectionChart(props: {
  data: ProjectionPoint[];
  currency: string;
}) {
  return (
    <ChartShell>
      <ResponsiveContainer>
        <AreaChart data={props.data}>
          <defs>
            <linearGradient id="projectionFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4bd7c7" stopOpacity={0.46} />
              <stop offset="95%" stopColor="#4bd7c7" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#8ca0b4" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8ca0b4" }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) {
                return null;
              }
              const item = payload[0].payload as ProjectionPoint;
              return (
                <TooltipCard
                  label={String(label)}
                  lines={[
                    `Price ${item.price.toFixed(2)}`,
                    `Value ${formatCompactCurrency(item.value, props.currency)}`,
                    `P/L ${formatCompactCurrency(item.pnl, props.currency)}`
                  ]}
                />
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#4bd7c7"
            strokeWidth={3}
            fill="url(#projectionFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function AllocationChart(props: {
  data: PortfolioAllocationResult[];
  currency: string;
}) {
  return (
    <ChartShell>
      <ResponsiveContainer>
        <PieChart>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) {
                return null;
              }
              const item = payload[0].payload as PortfolioAllocationResult;
              return (
                <TooltipCard
                  label={item.symbol}
                  lines={[
                    `${item.percent}% allocation`,
                    `${formatCompactCurrency(item.amount, props.currency)} value`
                  ]}
                />
              );
            }}
          />
          <Pie
            data={props.data}
            dataKey="amount"
            nameKey="symbol"
            innerRadius={62}
            outerRadius={92}
            paddingAngle={4}
          >
            {props.data.map((item) => (
              <Cell key={item.symbol} fill={item.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function DcaGrowthChart(props: {
  data: DcaPoint[];
  currency: string;
}) {
  return (
    <ChartShell>
      <ResponsiveContainer>
        <AreaChart data={props.data}>
          <defs>
            <linearGradient id="dcaInvested" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4b45f" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#f4b45f" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="dcaValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8da7ff" stopOpacity={0.36} />
              <stop offset="100%" stopColor="#8da7ff" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="step" axisLine={false} tickLine={false} tick={{ fill: "#8ca0b4" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8ca0b4" }} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) {
                return null;
              }
              const item = payload[0].payload as DcaPoint;
              return (
                <TooltipCard
                  label={`Period ${label}`}
                  lines={[
                    `Invested ${formatCompactCurrency(item.invested, props.currency)}`,
                    `Value ${formatCompactCurrency(item.value, props.currency)}`,
                    `Units ${item.units.toFixed(4)}`
                  ]}
                />
              );
            }}
          />
          <Area type="monotone" dataKey="invested" stroke="#f4b45f" fill="url(#dcaInvested)" />
          <Area type="monotone" dataKey="value" stroke="#8da7ff" fill="url(#dcaValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function ScenarioChart(props: {
  data: ScenarioRow[];
  currency: string;
}) {
  return (
    <ChartShell>
      <ResponsiveContainer>
        <BarChart data={props.data}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#8ca0b4" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#8ca0b4" }} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.16)" />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) {
                return null;
              }
              const item = payload[0].payload as ScenarioRow;
              return (
                <TooltipCard
                  label={String(label)}
                  lines={[
                    `Exit ${item.price.toFixed(2)}`,
                    `P/L ${formatCompactCurrency(item.pnl, props.currency)}`,
                    `ROI ${formatPercent(item.roi)}`
                  ]}
                />
              );
            }}
          />
          <Bar dataKey="pnl" radius={[12, 12, 0, 0]}>
            {props.data.map((item) => (
              <Cell
                key={item.label}
                fill={item.pnl >= 0 ? "#4bd7c7" : "#ff8e8e"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
