"use client";

import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className }: PanelProps) {
  return (
    <motion.section
      className={cn("panel p-5 sm:p-6", className)}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      {children}
    </motion.section>
  );
}

export function SectionHeading(props: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="text-[0.66rem] uppercase tracking-[0.28em] text-aqua/70">
          {props.eyebrow}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {props.title}
        </h2>
        <p className="max-w-3xl text-sm leading-6 text-muted">{props.description}</p>
      </div>
      {props.action ? <div className="shrink-0">{props.action}</div> : null}
    </div>
  );
}

export function MetricTile(props: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "good" | "danger";
}) {
  const toneClass =
    props.tone === "good"
      ? "text-aqua"
      : props.tone === "danger"
        ? "text-rose-300"
        : "text-ink";

  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-muted">{props.label}</p>
      <p className={cn("mt-3 text-2xl font-semibold tracking-tight", toneClass)}>
        {props.value}
      </p>
      {props.hint ? <p className="mt-2 text-sm text-muted">{props.hint}</p> : null}
    </div>
  );
}

export function ActionButton(props: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const variantClass =
    props.variant === "secondary"
      ? "border-white/10 bg-white/[0.06] text-ink hover:bg-white/10"
      : props.variant === "ghost"
        ? "border-transparent bg-transparent text-muted hover:bg-white/[0.06] hover:text-ink"
        : "border-[rgba(244,180,95,0.36)] bg-[linear-gradient(135deg,rgba(244,180,95,0.22),rgba(75,215,199,0.12))] text-ink hover:brightness-110";

  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variantClass,
        props.className
      )}
    >
      {props.children}
    </button>
  );
}

export function MiniBadge(props: { children: ReactNode; tone?: "default" | "live" | "demo" }) {
  const toneClass =
    props.tone === "live"
      ? "border-aqua/30 bg-aqua/10 text-aqua"
    : props.tone === "demo"
        ? "border-gold/30 bg-gold/10 text-gold"
        : "border-white/8 bg-white/[0.06] text-muted";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em]",
        toneClass
      )}
    >
      {props.children}
    </span>
  );
}

export function Field(props: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-2", props.className)}>
      <span className="text-[0.72rem] uppercase tracking-[0.2em] text-muted">
        {props.label}
      </span>
      {props.children}
      {props.hint ? <span className="text-xs text-muted">{props.hint}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-12 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-aqua/40 focus:bg-black/30",
        props.className
      )}
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-[120px] rounded-[22px] border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-muted focus:border-aqua/40 focus:bg-black/30",
        props.className
      )}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-12 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-ink outline-none transition focus:border-aqua/40 focus:bg-black/30",
        props.className
      )}
    />
  );
}

export function RangeField(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[0.72rem] uppercase tracking-[0.2em] text-muted">
          {props.label}
        </span>
        <span className="font-mono text-sm text-ink">
          {props.value}
          {props.suffix ?? ""}
        </span>
      </div>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step ?? 1}
        value={props.value}
        onChange={(event) => props.onChange(Number(event.target.value))}
        className="range-track w-full accent-[var(--color-gold)]"
      />
    </div>
  );
}

export function SegmentControl(props: {
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-white/8 bg-black/20 p-1">
      {props.options.map((option) => {
        const active = option.value === props.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => props.onChange(option.value)}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition",
              active
                ? "bg-white/10 text-ink shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
                : "text-muted hover:text-ink"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function TogglePill(props: {
  enabled: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={props.onToggle}
      className={cn(
        "inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm transition",
        props.enabled
          ? "border-aqua/30 bg-aqua/10 text-aqua"
          : "border-white/10 bg-white/[0.06] text-muted"
      )}
    >
      <span
        className={cn(
          "h-2.5 w-2.5 rounded-full transition",
          props.enabled ? "bg-aqua shadow-[0_0_18px_rgba(75,215,199,0.7)]" : "bg-white/30"
        )}
      />
      {props.label}
    </button>
  );
}
