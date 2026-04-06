"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  BrainCircuit,
  ChartCandlestick,
  CircleDollarSign,
  Cpu,
  Download,
  FolderClock,
  Layers3,
  Orbit,
  RefreshCw,
  Scale,
  Settings2,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  WalletCards
} from "lucide-react";
import { motion } from "framer-motion";
import {
  APP_NAME,
  APP_SUBTITLE,
  APP_TAGLINE,
  CRYPTO_ASSETS,
  DEFAULT_AI_SETTINGS,
  DEMO_ASSISTANT_PROMPT,
  DEMO_DCA_INPUT,
  DEMO_JOURNAL,
  DEMO_PORTFOLIO,
  DEMO_RISK_INPUT,
  DEMO_STAKING_INPUT,
  DEMO_TAX_INPUT,
  DEMO_TP_INPUT,
  DEMO_TRADE_INPUT,
  DEMO_WATCHLIST,
  FIAT_CURRENCIES,
  NATURAL_LANGUAGE_EXAMPLES,
  PROVIDER_PRESETS,
  STORAGE_KEYS
} from "@/lib/constants";
import {
  buildProjectionSeries,
  buildScenarioRows,
  calculateDcaSummary,
  calculateLiquidationEstimate,
  calculatePortfolioAllocation,
  calculateRiskRewardSummary,
  calculateStakingSummary,
  calculateTakeProfitRows,
  calculateTaxEstimate,
  calculateTradeSummary,
  parseTradePrompt
} from "@/lib/calculations";
import { fallbackAssistantResponse } from "@/lib/ai-fallbacks";
import { generateAssistantCopy } from "@/lib/ai-providers";
import { buildMockMarketState, fetchMarketPrices } from "@/lib/market-data";
import { downloadText, loadStorage, saveStorage } from "@/lib/storage";
import {
  AIProviderSettings,
  AssistantRequest,
  HistoryEntry,
  JournalEntry,
  MarketState,
  PortfolioAllocationItem,
  SnapshotEntry,
  TradeInput
} from "@/lib/types";
import {
  createId,
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  formatPercent,
  relativeTime,
  toCsv
} from "@/lib/utils";
import {
  ActionButton,
  Field,
  MetricTile,
  MiniBadge,
  Panel,
  RangeField,
  SectionHeading,
  SegmentControl,
  Select,
  TextArea,
  TextInput,
  TogglePill
} from "@/components/ui";
import {
  AllocationChart,
  DcaGrowthChart,
  ProjectionChart,
  ScenarioChart
} from "@/components/charts";

interface AppState {
  demoMode: boolean;
  focusMode: boolean;
  tradeInput: TradeInput;
  dcaInput: typeof DEMO_DCA_INPUT;
  portfolioValue: number;
  portfolioWeights: PortfolioAllocationItem[];
  stakingInput: typeof DEMO_STAKING_INPUT;
  riskInput: typeof DEMO_RISK_INPUT;
  tpInput: typeof DEMO_TP_INPUT;
  taxInput: typeof DEMO_TAX_INPUT;
  aiSettings: AIProviderSettings;
  assistantPrompt: string;
  watchlist: string[];
  liquidationType: "long" | "short";
  maintenanceMarginPercent: number;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: ChartCandlestick },
  { id: "calculator-hub", label: "Calculator Hub", icon: CircleDollarSign },
  { id: "ai-assistant", label: "AI Assistant", icon: Bot },
  { id: "portfolio-tools", label: "Portfolio Tools", icon: Layers3 },
  { id: "settings", label: "Settings", icon: Settings2 },
  { id: "about", label: "About", icon: ShieldAlert }
] as const;

const QUICK_PRESETS: Array<{ label: string; data: TradeInput }> = [
  { label: "SOL Breakout", data: DEMO_TRADE_INPUT },
  {
    label: "ETH Swing",
    data: {
      asset: "ETH",
      fiat: "USD",
      amount: 18000,
      quantity: 5.2,
      buyPrice: 4120,
      currentPrice: 4890,
      sellPrice: 5360,
      feesPercent: 0.28,
      slippagePercent: 0.4,
      leverage: 2
    }
  },
  {
    label: "BTC Treasury",
    data: {
      asset: "BTC",
      fiat: "USD",
      amount: 45000,
      quantity: 0.52,
      buyPrice: 88400,
      currentPrice: 94320,
      sellPrice: 101500,
      feesPercent: 0.18,
      slippagePercent: 0.15,
      leverage: 1
    }
  },
  {
    label: "AVAX Momentum",
    data: {
      asset: "AVAX",
      fiat: "USD",
      amount: 12000,
      quantity: 210,
      buyPrice: 49.5,
      currentPrice: 54.2,
      sellPrice: 62.8,
      feesPercent: 0.35,
      slippagePercent: 0.75,
      leverage: 4
    }
  }
];

export function CryptoCalculatorApp() {
  const [demoMode, setDemoMode] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [tradeInput, setTradeInput] = useState<TradeInput>(DEMO_TRADE_INPUT);
  const [dcaInput, setDcaInput] = useState(DEMO_DCA_INPUT);
  const [portfolioValue, setPortfolioValue] = useState(92000);
  const [portfolioWeights, setPortfolioWeights] = useState<PortfolioAllocationItem[]>(DEMO_PORTFOLIO);
  const [stakingInput, setStakingInput] = useState(DEMO_STAKING_INPUT);
  const [riskInput, setRiskInput] = useState(DEMO_RISK_INPUT);
  const [tpInput, setTpInput] = useState(DEMO_TP_INPUT);
  const [taxInput, setTaxInput] = useState(DEMO_TAX_INPUT);
  const [watchlist, setWatchlist] = useState<string[]>(DEMO_WATCHLIST);
  const [liquidationType, setLiquidationType] = useState<"long" | "short">("long");
  const [maintenanceMarginPercent, setMaintenanceMarginPercent] = useState(0.6);
  const [aiSettings, setAiSettings] = useState<AIProviderSettings>(DEFAULT_AI_SETTINGS);
  const [assistantPrompt, setAssistantPrompt] = useState(DEMO_ASSISTANT_PROMPT);
  const [assistantOutput, setAssistantOutput] = useState(
    "Demo strategist loaded. Ask for a plain-English trade explanation, a scenario comparison, or an allocation summary."
  );
  const [assistantMeta, setAssistantMeta] = useState("Demo strategist");
  const [assistantMode, setAssistantMode] = useState<"live" | "demo">("demo");
  const [assistantBusy, setAssistantBusy] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [snapshots, setSnapshots] = useState<SnapshotEntry[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(DEMO_JOURNAL);
  const [journalHeadline, setJournalHeadline] = useState("");
  const [journalBody, setJournalBody] = useState("");
  const [marketState, setMarketState] = useState<MarketState>(buildMockMarketState("Loading market feed..."));
  const [hydrated, setHydrated] = useState(false);

  const tradeSummary = calculateTradeSummary(tradeInput);
  const scenarioRows = buildScenarioRows(tradeInput);
  const projectionData = buildProjectionSeries(tradeInput);
  const dcaSummary = calculateDcaSummary(dcaInput);
  const allocationRows = calculatePortfolioAllocation(portfolioValue, portfolioWeights);
  const stakingSummary = calculateStakingSummary(stakingInput);
  const riskSummary = calculateRiskRewardSummary(riskInput);
  const takeProfitRows = calculateTakeProfitRows(tpInput);
  const liquidationEstimate = calculateLiquidationEstimate({
    entryPrice: tradeInput.buyPrice,
    leverage: tradeInput.leverage,
    maintenanceMarginPercent,
    positionType: liquidationType
  });
  const taxEstimate = calculateTaxEstimate(taxInput);
  const portfolioWeightTotal = portfolioWeights.reduce((sum, item) => sum + item.percent, 0);

  useEffect(() => {
    const saved = loadStorage<AppState | null>(STORAGE_KEYS.appState, null);
    const savedHistory = loadStorage<HistoryEntry[]>(STORAGE_KEYS.history, []);
    const savedJournal = loadStorage<JournalEntry[]>(STORAGE_KEYS.journal, DEMO_JOURNAL);

    if (saved) {
      setDemoMode(saved.demoMode);
      setFocusMode(saved.focusMode);
      setTradeInput(saved.tradeInput);
      setDcaInput(saved.dcaInput);
      setPortfolioValue(saved.portfolioValue);
      setPortfolioWeights(saved.portfolioWeights);
      setStakingInput(saved.stakingInput);
      setRiskInput(saved.riskInput);
      setTpInput(saved.tpInput);
      setTaxInput(saved.taxInput);
      setAiSettings(saved.aiSettings);
      setAssistantPrompt(saved.assistantPrompt);
      setWatchlist(saved.watchlist);
      setLiquidationType(saved.liquidationType);
      setMaintenanceMarginPercent(saved.maintenanceMarginPercent);
    }

    setHistory(savedHistory);
    setJournalEntries(savedJournal);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveStorage(STORAGE_KEYS.appState, {
      demoMode,
      focusMode,
      tradeInput,
      dcaInput,
      portfolioValue,
      portfolioWeights,
      stakingInput,
      riskInput,
      tpInput,
      taxInput,
      aiSettings,
      assistantPrompt,
      watchlist,
      liquidationType,
      maintenanceMarginPercent
    } satisfies AppState);
  }, [aiSettings, assistantPrompt, dcaInput, demoMode, focusMode, hydrated, liquidationType, maintenanceMarginPercent, portfolioValue, portfolioWeights, riskInput, stakingInput, taxInput, tpInput, tradeInput, watchlist]);

  useEffect(() => {
    if (!hydrated) return;
    saveStorage(STORAGE_KEYS.history, history);
  }, [history, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveStorage(STORAGE_KEYS.journal, journalEntries);
  }, [hydrated, journalEntries]);

  useEffect(() => {
    let active = true;
    setMarketState((current) => ({ ...current, status: "loading", message: "Refreshing live market feed..." }));
    fetchMarketPrices().then((result) => {
      if (active) setMarketState(result);
    });
    return () => {
      active = false;
    };
  }, []);

  function jumpToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement | null)?.tagName;
      if (event.key === "/") {
        event.preventDefault();
        document.getElementById("assistant-prompt")?.focus();
      }

      if (event.key.toLowerCase() === "d" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        event.preventDefault();
        setDemoMode((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const livePrice = marketState.prices[tradeInput.asset]?.values[tradeInput.fiat];
    if (!livePrice || !demoMode) {
      return;
    }

    setTradeInput((current) => ({
      ...current,
      currentPrice: Number(livePrice.toFixed(4)),
      sellPrice: Number((livePrice * 1.17).toFixed(4))
    }));
  }, [demoMode, marketState.prices, tradeInput.asset, tradeInput.fiat]);

  function retryMarketFeed() {
    setMarketState((current) => ({ ...current, status: "loading", message: "Retrying live price feed..." }));
    fetchMarketPrices().then((result) => setMarketState(result));
  }

  function syncCurrentPriceFromMarket() {
    const livePrice = marketState.prices[tradeInput.asset]?.values[tradeInput.fiat];
    if (!livePrice) {
      return;
    }
    setTradeInput((current) => ({ ...current, currentPrice: Number(livePrice.toFixed(4)) }));
  }

  function updateTradeField<Key extends keyof TradeInput>(key: Key, value: TradeInput[Key]) {
    setTradeInput((current) => ({ ...current, [key]: value }));
  }

  function updatePortfolioWeight(index: number, percent: number) {
    setPortfolioWeights((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, percent } : item))
    );
  }

  function applyPreset(input: TradeInput) {
    setTradeInput(input);
    setAssistantPrompt(
      `Review this ${input.asset} setup: quantity ${input.quantity}, buy ${input.buyPrice}, current ${input.currentPrice}, target ${input.sellPrice}, ${input.leverage}x leverage, ${input.feesPercent}% fees and ${input.slippagePercent}% slippage.`
    );
    jumpToSection("calculator-hub");
  }

  function applyNaturalLanguageAutofill() {
    const parsed = parseTradePrompt(
      assistantPrompt,
      CRYPTO_ASSETS.map((asset) => asset.symbol),
      FIAT_CURRENCIES.map((fiat) => fiat.code)
    );
    setTradeInput((current) => ({ ...current, ...parsed }));
    jumpToSection("calculator-hub");
  }

  function saveCurrentCalculation() {
    const entry: HistoryEntry = {
      id: createId("calc"),
      label: `${tradeInput.asset} ${tradeInput.leverage}x @ ${tradeInput.buyPrice}`,
      createdAt: new Date().toISOString(),
      input: tradeInput,
      summary: tradeSummary
    };
    setHistory((current) => [entry, ...current].slice(0, 12));
  }

  function exportHistory(kind: "json" | "csv") {
    if (kind === "json") {
      downloadText("helix-ledger-history.json", JSON.stringify(history, null, 2), "application/json");
      return;
    }

    const csv = toCsv(
      history.map((entry) => ({
        label: entry.label,
        createdAt: entry.createdAt,
        asset: entry.input.asset,
        fiat: entry.input.fiat,
        buyPrice: entry.input.buyPrice,
        currentPrice: entry.input.currentPrice,
        sellPrice: entry.input.sellPrice,
        pnl: entry.summary.pnl,
        roiAfterFees: entry.summary.roiAfterFees
      }))
    );
    downloadText("helix-ledger-history.csv", csv, "text/csv");
  }

  function savePortfolioSnapshot() {
    const snapshot: SnapshotEntry = {
      id: createId("snap"),
      createdAt: new Date().toISOString(),
      note: `Blend ${portfolioWeights.slice(0, 3).map((item) => item.symbol).join("/")}`,
      totalValue: portfolioValue
    };
    setSnapshots((current) => [snapshot, ...current].slice(0, 8));
  }

  function addJournalEntry() {
    if (!journalHeadline.trim() || !journalBody.trim()) {
      return;
    }

    const entry: JournalEntry = {
      id: createId("journal"),
      createdAt: new Date().toISOString(),
      headline: journalHeadline.trim(),
      body: journalBody.trim()
    };
    setJournalEntries((current) => [entry, ...current].slice(0, 10));
    setJournalHeadline("");
    setJournalBody("");
  }

  async function runAssistantTask(task: "explain" | "compare" | "portfolio" | "sentiment" | "risk") {
    setAssistantBusy(true);

    const request: AssistantRequest = {
      title: task,
      system:
        "You are a concise crypto risk assistant. Use only the data given to you in this prompt. Do not invent external market data, legal advice, or financial guarantees.",
      prompt: JSON.stringify(
        {
          task,
          tradeInput,
          tradeSummary,
          scenarios: scenarioRows,
          portfolio: allocationRows,
          watchlist: watchlist.map((symbol) => ({
            symbol,
            price: marketState.prices[symbol]?.values[tradeInput.fiat] ?? null,
            change24h: marketState.prices[symbol]?.change24h ?? null
          })),
          userPrompt: assistantPrompt
        },
        null,
        2
      )
    };

    try {
      const result = aiSettings.apiKey.trim()
        ? await generateAssistantCopy(aiSettings, request)
        : fallbackAssistantResponse({
            task,
            tradeInput,
            tradeSummary,
            scenarios: scenarioRows,
            allocations: allocationRows,
            providerName: aiSettings.providerName
          });

      setAssistantOutput(result.content);
      setAssistantMeta(result.providerUsed);
      setAssistantMode(result.mode);
    } catch (error) {
      const fallback = fallbackAssistantResponse({
        task,
        tradeInput,
        tradeSummary,
        scenarios: scenarioRows,
        allocations: allocationRows,
        providerName: aiSettings.providerName
      });
      setAssistantOutput(
        `${fallback.content}\n\nLive request failed and demo guidance was used instead: ${
          error instanceof Error ? error.message : "Unknown provider error"
        }`
      );
      setAssistantMeta(fallback.providerUsed);
      setAssistantMode("demo");
    } finally {
      setAssistantBusy(false);
    }
  }

  function applyProviderPreset(providerType: AIProviderSettings["providerType"]) {
    const preset = PROVIDER_PRESETS[providerType];
    if (!preset) {
      return;
    }
    setAiSettings((current) => ({
      ...current,
      providerType,
      providerName: preset.providerName ?? current.providerName,
      model: preset.model ?? current.model,
      baseUrl: preset.baseUrl ?? current.baseUrl
    }));
  }

  const watchlistRows = watchlist.map((symbol) => {
    const asset = CRYPTO_ASSETS.find((item) => item.symbol === symbol);
    const price = marketState.prices[symbol];
    return {
      symbol,
      name: asset?.name ?? symbol,
      accent: asset?.accent ?? "#fff",
      price: price?.values[tradeInput.fiat] ?? 0,
      change24h: price?.change24h ?? 0
    };
  });

  return (
    <div className={focusMode ? "focus-mode" : ""}>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="ambient-halo ambient-halo-gold" />
        <div className="ambient-halo ambient-halo-aqua" />
        <div className="ambient-grid" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 pb-28 pt-5 sm:px-6 lg:px-8">
        <aside className="hidden w-[292px] shrink-0 lg:flex">
          <div className="sticky top-5 flex h-[calc(100vh-2.5rem)] w-full flex-col gap-5 rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,20,25,0.98),rgba(8,11,14,0.94))] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="space-y-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                <Orbit className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-[0.68rem] uppercase tracking-[0.32em] text-aqua/70">Trader Edition</p>
                <h1 className="text-3xl font-semibold tracking-tight text-ink">{APP_NAME}</h1>
                <p className="font-mono text-xs uppercase tracking-[0.26em] text-gold/70">{APP_TAGLINE}</p>
              </div>
              <p className="text-sm leading-6 text-muted">{APP_SUBTITLE}</p>
            </div>

            <nav className="grid gap-2">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button key={item.id} type="button" onClick={() => jumpToSection(item.id)} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-left text-sm text-muted transition hover:border-aqua/20 hover:bg-white/[0.06] hover:text-ink">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4">
              <TogglePill enabled={demoMode} onToggle={() => setDemoMode((current) => !current)} label="Demo mode enabled" />
              <TogglePill enabled={focusMode} onToggle={() => setFocusMode((current) => !current)} label="Reduced motion focus" />

              <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-muted">Watchlist</p>
                  <MiniBadge tone={marketState.source === "live" ? "live" : "demo"}>{marketState.source}</MiniBadge>
                </div>
                <div className="mt-4 space-y-3">
                  {watchlistRows.map((item) => (
                    <div key={item.symbol} className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.accent }} />
                        <div>
                          <p className="text-sm text-ink">{item.symbol}</p>
                          <p className="text-xs text-muted">{item.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-ink">{item.price.toFixed(2)}</p>
                        <p className={`text-xs ${item.change24h >= 0 ? "text-aqua" : "text-rose-300"}`}>{item.change24h.toFixed(2)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <section id="dashboard" className="space-y-6">
            <Panel className="overflow-hidden">
              <div className="grid gap-6 xl:grid-cols-[1.28fr_0.72fr]">
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <MiniBadge tone={demoMode ? "demo" : "live"}>
                      {demoMode ? "Demo-ready" : "Live mode"}
                    </MiniBadge>
                    <MiniBadge tone={assistantMode === "live" ? "live" : "demo"}>
                      AI {assistantMode}
                    </MiniBadge>
                    <MiniBadge tone={marketState.source === "live" ? "live" : "demo"}>
                      Market {marketState.source}
                    </MiniBadge>
                  </div>

                  <div className="max-w-4xl space-y-4">
                    <h2 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                      Price the trade, pressure-test the exit, and hand the thesis to AI.
                    </h2>
                    <p className="max-w-3xl text-base leading-7 text-muted">
                      Aether Ledger is a premium crypto calculator cockpit for traders and
                      operators who need conversion, P/L, DCA, portfolio weighting, and
                      risk narration in one fast-moving workspace.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <MetricTile
                      label="Net Exit"
                      value={formatCompactCurrency(tradeSummary.netProceeds, tradeInput.fiat)}
                      hint={`${tradeInput.asset} planned sell @ ${tradeInput.sellPrice}`}
                    />
                    <MetricTile
                      label="Return After Fees"
                      value={formatPercent(tradeSummary.roiAfterFees)}
                      hint={`Margin used ${formatCompactCurrency(tradeSummary.marginUsed, tradeInput.fiat)}`}
                      tone={tradeSummary.roiAfterFees >= 0 ? "good" : "danger"}
                    />
                    <MetricTile
                      label="Break-even"
                      value={formatCurrency(tradeSummary.breakEvenPrice, tradeInput.fiat)}
                      hint={`Liquidation est. ${tradeSummary.liquidationPrice.toFixed(2)}`}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    {QUICK_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyPreset(preset.data)}
                        className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-3 text-left transition hover:border-gold/20 hover:bg-white/[0.06]"
                      >
                        <p className="text-sm text-ink">{preset.label}</p>
                        <p className="mt-1 text-xs text-muted">
                          {preset.data.asset} | {preset.data.leverage}x |{" "}
                          {formatCurrency(preset.data.currentPrice, preset.data.fiat)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="hero-chart-shell">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[0.7rem] uppercase tracking-[0.24em] text-muted">
                          Scenario Projection
                        </p>
                        <p className="mt-1 text-lg text-ink">
                          Visual trade ladder from stress to breakout
                        </p>
                      </div>
                      <ActionButton variant="secondary" onClick={saveCurrentCalculation}>
                        <FolderClock className="h-4 w-4" />
                        Save setup
                      </ActionButton>
                    </div>
                    <ProjectionChart data={projectionData} currency={tradeInput.fiat} />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[26px] border border-white/8 bg-black/20 p-4">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4 text-aqua" />
                        <p className="text-sm text-ink">AI reflection</p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted">{assistantOutput}</p>
                    </div>
                    <div className="rounded-[26px] border border-white/8 bg-black/20 p-4">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-gold" />
                        <p className="text-sm text-ink">Market source</p>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-muted">{marketState.message}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <ActionButton variant="secondary" onClick={retryMarketFeed}>
                          <RefreshCw className="h-4 w-4" />
                          Retry feed
                        </ActionButton>
                        <ActionButton variant="ghost" onClick={syncCurrentPriceFromMarket}>
                          Sync current price
                        </ActionButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>

            <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
              <Panel>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted">
                      Market Ribbon
                    </p>
                    <p className="mt-1 text-xl text-ink">Favorite assets</p>
                  </div>
                  <ActionButton variant="ghost" onClick={retryMarketFeed}>
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </ActionButton>
                </div>
                <div className="space-y-3">
                  {watchlistRows.map((item) => (
                    <div
                      key={item.symbol}
                      className="flex items-center justify-between rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.accent }}
                        />
                        <div>
                          <p className="text-sm text-ink">{item.symbol}</p>
                          <p className="text-xs text-muted">{item.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-ink">
                          {formatCurrency(item.price, tradeInput.fiat)}
                        </p>
                        <p
                          className={`text-xs ${item.change24h >= 0 ? "text-aqua" : "text-rose-300"}`}
                        >
                          {formatPercent(item.change24h)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.22em] text-muted">
                      Scenario Ladder
                    </p>
                    <p className="mt-1 text-xl text-ink">
                      Bear, base, and bull outcome comparison
                    </p>
                  </div>
                  <MiniBadge tone={marketState.source === "live" ? "live" : "demo"}>
                    {marketState.lastUpdated
                      ? `Updated ${relativeTime(marketState.lastUpdated)}`
                      : "Waiting"}
                  </MiniBadge>
                </div>
                <ScenarioChart data={scenarioRows} currency={tradeInput.fiat} />
              </Panel>
            </div>
          </section>
          <section id="calculator-hub" className="space-y-6">
            <Panel>
              <SectionHeading
                eyebrow="Calculator Hub"
                title="Main trade calculator"
                description="Convert crypto to fiat, estimate profit after fees and slippage, and keep leverage risk visible at every step."
                action={
                  <div className="flex flex-wrap gap-2">
                    <ActionButton variant="secondary" onClick={syncCurrentPriceFromMarket}>
                      <Activity className="h-4 w-4" />
                      Pull live spot
                    </ActionButton>
                    <ActionButton onClick={saveCurrentCalculation}>
                      <FolderClock className="h-4 w-4" />
                      Save history
                    </ActionButton>
                  </div>
                }
              />

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <Field label="Asset">
                      <Select
                        value={tradeInput.asset}
                        onChange={(event) => updateTradeField("asset", event.target.value)}
                      >
                        {CRYPTO_ASSETS.map((asset) => (
                          <option key={asset.symbol} value={asset.symbol}>
                            {asset.symbol} | {asset.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Fiat">
                      <Select
                        value={tradeInput.fiat}
                        onChange={(event) => updateTradeField("fiat", event.target.value)}
                      >
                        {FIAT_CURRENCIES.map((fiat) => (
                          <option key={fiat.code} value={fiat.code}>
                            {fiat.code} | {fiat.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Amount">
                      <TextInput
                        type="number"
                        value={tradeInput.amount}
                        onChange={(event) => updateTradeField("amount", Number(event.target.value))}
                      />
                    </Field>
                    <Field label="Quantity">
                      <TextInput
                        type="number"
                        step="0.0001"
                        value={tradeInput.quantity}
                        onChange={(event) => updateTradeField("quantity", Number(event.target.value))}
                      />
                    </Field>
                    <Field label="Buy price">
                      <TextInput
                        type="number"
                        step="0.0001"
                        value={tradeInput.buyPrice}
                        onChange={(event) => updateTradeField("buyPrice", Number(event.target.value))}
                      />
                    </Field>
                    <Field
                      label="Current price"
                      hint={
                        marketState.prices[tradeInput.asset]
                          ? `Live ${formatCurrency(marketState.prices[tradeInput.asset].values[tradeInput.fiat], tradeInput.fiat)}`
                          : undefined
                      }
                    >
                      <TextInput
                        type="number"
                        step="0.0001"
                        value={tradeInput.currentPrice}
                        onChange={(event) => updateTradeField("currentPrice", Number(event.target.value))}
                      />
                    </Field>
                    <Field label="Sell price">
                      <TextInput
                        type="number"
                        step="0.0001"
                        value={tradeInput.sellPrice}
                        onChange={(event) => updateTradeField("sellPrice", Number(event.target.value))}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-3">
                    <RangeField
                      label="Fees"
                      value={tradeInput.feesPercent}
                      min={0}
                      max={2}
                      step={0.01}
                      suffix="%"
                      onChange={(value) => updateTradeField("feesPercent", value)}
                    />
                    <RangeField
                      label="Slippage"
                      value={tradeInput.slippagePercent}
                      min={0}
                      max={3}
                      step={0.05}
                      suffix="%"
                      onChange={(value) => updateTradeField("slippagePercent", value)}
                    />
                    <RangeField
                      label="Leverage"
                      value={tradeInput.leverage}
                      min={1}
                      max={20}
                      step={1}
                      suffix="x"
                      onChange={(value) => updateTradeField("leverage", value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <MetricTile
                    label="Current Value"
                    value={formatCurrency(tradeSummary.currentValue, tradeInput.fiat)}
                    hint={`${formatNumber(tradeSummary.effectiveQuantity, 4)} ${tradeInput.asset}`}
                  />
                  <MetricTile
                    label="Current P/L"
                    value={formatCurrency(tradeSummary.currentPnl, tradeInput.fiat)}
                    hint={formatPercent(tradeSummary.currentPnlPercent)}
                    tone={tradeSummary.currentPnl >= 0 ? "good" : "danger"}
                  />
                  <MetricTile
                    label="Estimated Fees"
                    value={formatCurrency(tradeSummary.totalFees, tradeInput.fiat)}
                    hint={`Slippage ${formatCurrency(tradeSummary.slippageCost, tradeInput.fiat)}`}
                  />
                  <MetricTile
                    label="Net Proceeds"
                    value={formatCurrency(tradeSummary.netProceeds, tradeInput.fiat)}
                    hint={`Exit @ ${tradeInput.sellPrice}`}
                  />
                  <MetricTile
                    label="Profit / Loss"
                    value={formatCurrency(tradeSummary.pnl, tradeInput.fiat)}
                    hint={formatPercent(tradeSummary.pnlPercent)}
                    tone={tradeSummary.pnl >= 0 ? "good" : "danger"}
                  />
                  <MetricTile
                    label="Margin Used"
                    value={formatCurrency(tradeSummary.marginUsed, tradeInput.fiat)}
                    hint={`Liquidation est. ${tradeSummary.liquidationPrice.toFixed(2)}`}
                  />
                </div>
              </div>
            </Panel>

            <div className="grid gap-6 xl:grid-cols-2">
              <Panel>
                <div className="mb-4 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-gold" />
                  <h3 className="text-lg text-ink">Risk to reward planner</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Entry price">
                    <TextInput
                      type="number"
                      value={riskInput.entryPrice}
                      onChange={(event) => setRiskInput((current) => ({ ...current, entryPrice: Number(event.target.value) }))}
                    />
                  </Field>
                  <Field label="Stop loss">
                    <TextInput
                      type="number"
                      value={riskInput.stopLoss}
                      onChange={(event) => setRiskInput((current) => ({ ...current, stopLoss: Number(event.target.value) }))}
                    />
                  </Field>
                  <Field label="Take profit">
                    <TextInput
                      type="number"
                      value={riskInput.takeProfit}
                      onChange={(event) => setRiskInput((current) => ({ ...current, takeProfit: Number(event.target.value) }))}
                    />
                  </Field>
                  <Field label="Account size">
                    <TextInput
                      type="number"
                      value={riskInput.accountSize}
                      onChange={(event) => setRiskInput((current) => ({ ...current, accountSize: Number(event.target.value) }))}
                    />
                  </Field>
                </div>
                <div className="mt-4">
                  <RangeField
                    label="Risk %"
                    value={riskInput.riskPercent}
                    min={0.25}
                    max={5}
                    step={0.25}
                    suffix="%"
                    onChange={(value) => setRiskInput((current) => ({ ...current, riskPercent: value }))}
                  />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <MetricTile
                    label="Risk/Reward"
                    value={`${riskSummary.ratio}:1`}
                    hint={`Risk per unit ${riskSummary.riskPerUnit}`}
                  />
                  <MetricTile
                    label="Position Size"
                    value={formatNumber(riskSummary.positionSize, 2)}
                    hint={`Capital at risk ${formatCurrency(riskSummary.capitalAtRisk, tradeInput.fiat)}`}
                  />
                </div>
              </Panel>

              <Panel>
                <div className="mb-4 flex items-center gap-2">
                  <Target className="h-4 w-4 text-aqua" />
                  <h3 className="text-lg text-ink">Take-profit ladder</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Position size">
                    <TextInput
                      type="number"
                      value={tpInput.positionSize}
                      onChange={(event) => setTpInput((current) => ({ ...current, positionSize: Number(event.target.value) }))}
                    />
                  </Field>
                  <Field label="Entry">
                    <TextInput
                      type="number"
                      value={tpInput.entryPrice}
                      onChange={(event) => setTpInput((current) => ({ ...current, entryPrice: Number(event.target.value) }))}
                    />
                  </Field>
                  <Field label="Target 1">
                    <TextInput
                      type="number"
                      value={tpInput.target1}
                      onChange={(event) => setTpInput((current) => ({ ...current, target1: Number(event.target.value) }))}
                    />
                  </Field>
                  <Field label="Target 2">
                    <TextInput
                      type="number"
                      value={tpInput.target2}
                      onChange={(event) => setTpInput((current) => ({ ...current, target2: Number(event.target.value) }))}
                    />
                  </Field>
                </div>
                <Field label="Target 3" className="mt-4">
                  <TextInput
                    type="number"
                    value={tpInput.target3}
                    onChange={(event) => setTpInput((current) => ({ ...current, target3: Number(event.target.value) }))}
                  />
                </Field>
                <div className="mt-5 space-y-3">
                  {takeProfitRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-3">
                      <div>
                        <p className="text-sm text-ink">{row.label}</p>
                        <p className="text-xs text-muted">Gain per unit {row.gainPerUnit.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-ink">{formatCurrency(row.targetPrice, tradeInput.fiat)}</p>
                        <p className="text-xs text-aqua">{formatCurrency(row.grossValue, tradeInput.fiat)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel>
                <div className="mb-4 flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-300" />
                  <h3 className="text-lg text-ink">Leverage liquidation estimator</h3>
                </div>
                <div className="space-y-4">
                  <SegmentControl
                    value={liquidationType}
                    onChange={(value) => setLiquidationType(value as "long" | "short")}
                    options={[
                      { value: "long", label: "Long" },
                      { value: "short", label: "Short" }
                    ]}
                  />
                  <RangeField
                    label="Maintenance margin"
                    value={maintenanceMarginPercent}
                    min={0.3}
                    max={5}
                    step={0.1}
                    suffix="%"
                    onChange={setMaintenanceMarginPercent}
                  />
                  <div className="rounded-[24px] border border-rose-300/12 bg-rose-300/5 p-4">
                    <p className="text-sm text-ink">
                      Estimated liquidation at{" "}
                      <span className="font-semibold">{formatCurrency(liquidationEstimate, tradeInput.fiat)}</span>
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      This is a simplified estimate, not exchange-specific liquidation logic.
                      Funding, maintenance tiers, and cross-margin behavior can change the real
                      trigger substantially.
                    </p>
                  </div>
                </div>
              </Panel>

              <Panel>
                <div className="mb-4 flex items-center gap-2">
                  <WalletCards className="h-4 w-4 text-gold" />
                  <h3 className="text-lg text-ink">Tax estimate helper</h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Estimated gains">
                    <TextInput
                      type="number"
                      value={taxInput.gains}
                      onChange={(event) => setTaxInput((current) => ({ ...current, gains: Number(event.target.value) }))}
                    />
                  </Field>
                  <Field label="Holding months">
                    <TextInput
                      type="number"
                      value={taxInput.holdingMonths}
                      onChange={(event) => setTaxInput((current) => ({ ...current, holdingMonths: Number(event.target.value) }))}
                    />
                  </Field>
                </div>
                <div className="mt-4">
                  <RangeField
                    label="Estimated tax rate"
                    value={taxInput.estimatedTaxRate}
                    min={5}
                    max={45}
                    step={1}
                    suffix="%"
                    onChange={(value) => setTaxInput((current) => ({ ...current, estimatedTaxRate: value }))}
                  />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <MetricTile
                    label="Tax amount"
                    value={formatCurrency(taxEstimate.taxAmount, tradeInput.fiat)}
                    hint={`Effective rate ${formatPercent(taxEstimate.effectiveRate)}`}
                  />
                  <MetricTile
                    label="After-tax gain"
                    value={formatCurrency(taxEstimate.afterTaxGain, tradeInput.fiat)}
                    hint="Informational only"
                  />
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">
                  This helper is not legal, tax, or financial advice. Real obligations depend
                  on jurisdiction, holding period, offsets, and whether activity is personal,
                  business, or professional trading.
                </p>
              </Panel>
            </div>
          </section>
          <section id="ai-assistant" className="space-y-6">
            <Panel>
              <SectionHeading
                eyebrow="AI Assistant"
                title="Natural-language trade copilot"
                description="Parse setups from plain English, explain results, compare scenarios, summarize portfolio posture, and generate trade reflection prompts using your chosen provider or demo mode."
                action={
                  <MiniBadge tone={assistantMode === "live" ? "live" : "demo"}>
                    {assistantMode === "live" ? assistantMeta : "Demo strategist"}
                  </MiniBadge>
                }
              />

              <div className="mt-6 grid gap-6 xl:grid-cols-[0.96fr_1.04fr]">
                <div className="space-y-5">
                  <Field label="Natural language prompt">
                    <TextArea
                      id="assistant-prompt"
                      value={assistantPrompt}
                      onChange={(event) => setAssistantPrompt(event.target.value)}
                    />
                  </Field>

                  <div className="flex flex-wrap gap-2">
                    {NATURAL_LANGUAGE_EXAMPLES.map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setAssistantPrompt(example)}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs text-muted transition hover:border-aqua/20 hover:text-ink"
                      >
                        {example}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <ActionButton onClick={applyNaturalLanguageAutofill}>
                      <Sparkles className="h-4 w-4" />
                      AI auto-fill helper
                    </ActionButton>
                    <ActionButton variant="secondary" onClick={() => runAssistantTask("explain")} disabled={assistantBusy}>
                      <Bot className="h-4 w-4" />
                      Explain results
                    </ActionButton>
                    <ActionButton variant="secondary" onClick={() => runAssistantTask("compare")} disabled={assistantBusy}>
                      <TrendingUp className="h-4 w-4" />
                      Compare scenarios
                    </ActionButton>
                    <ActionButton variant="secondary" onClick={() => runAssistantTask("portfolio")} disabled={assistantBusy}>
                      <Layers3 className="h-4 w-4" />
                      Portfolio summary
                    </ActionButton>
                    <ActionButton variant="secondary" onClick={() => runAssistantTask("sentiment")} disabled={assistantBusy}>
                      <ChartCandlestick className="h-4 w-4" />
                      Sentiment summary
                    </ActionButton>
                    <ActionButton variant="secondary" onClick={() => runAssistantTask("risk")} disabled={assistantBusy}>
                      <ShieldAlert className="h-4 w-4" />
                      Risk notes
                    </ActionButton>
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[0.72rem] uppercase tracking-[0.22em] text-muted">
                        Assistant Output
                      </p>
                      <p className="mt-1 text-lg text-ink">
                        {assistantBusy ? "Thinking through your setup..." : assistantMeta}
                      </p>
                    </div>
                    <MiniBadge tone={assistantMode === "live" ? "live" : "demo"}>
                      {assistantMode}
                    </MiniBadge>
                  </div>
                  <motion.div
                    key={assistantOutput}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-[24px] border border-white/8 bg-black/20 p-5"
                  >
                    <p className="whitespace-pre-line text-sm leading-7 text-ink/90">
                      {assistantOutput}
                    </p>
                  </motion.div>
                </div>
              </div>
            </Panel>
          </section>
          <section id="portfolio-tools" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
              <Panel>
                <SectionHeading
                  eyebrow="Portfolio Tools"
                  title="Allocation planner"
                  description="Adjust portfolio weights, visualize the blend, and snapshot your current posture for quick marketplace-ready demos."
                  action={
                    <ActionButton variant="secondary" onClick={savePortfolioSnapshot}>
                      <Download className="h-4 w-4" />
                      Save snapshot
                    </ActionButton>
                  }
                />

                <div className="mt-6 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
                  <div className="space-y-4">
                    <Field label="Portfolio value">
                      <TextInput
                        type="number"
                        value={portfolioValue}
                        onChange={(event) => setPortfolioValue(Number(event.target.value))}
                      />
                    </Field>
                    {portfolioWeights.map((item, index) => (
                      <Field key={item.symbol} label={`${item.symbol} allocation`}>
                        <div className="grid grid-cols-[1fr_auto] gap-3">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={item.percent}
                            onChange={(event) => updatePortfolioWeight(index, Number(event.target.value))}
                            className="range-track w-full accent-[var(--color-aqua)]"
                          />
                          <TextInput
                            type="number"
                            value={item.percent}
                            onChange={(event) => updatePortfolioWeight(index, Number(event.target.value))}
                            className="w-24"
                          />
                        </div>
                      </Field>
                    ))}
                    <p className={`text-sm ${portfolioWeightTotal === 100 ? "text-aqua" : "text-gold"}`}>
                      Allocation total: {portfolioWeightTotal}%
                    </p>
                    {snapshots.length ? (
                      <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-muted">
                          Saved snapshots
                        </p>
                        <div className="mt-3 space-y-2">
                          {snapshots.map((snapshot) => (
                            <div key={snapshot.id} className="flex items-center justify-between rounded-2xl bg-black/20 px-3 py-2">
                              <div>
                                <p className="text-sm text-ink">{snapshot.note}</p>
                                <p className="text-xs text-muted">{relativeTime(snapshot.createdAt)}</p>
                              </div>
                              <p className="text-sm text-aqua">{formatCurrency(snapshot.totalValue, tradeInput.fiat)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="space-y-4">
                    <AllocationChart data={allocationRows} currency={tradeInput.fiat} />
                    <div className="grid gap-3 sm:grid-cols-2">
                      {allocationRows.map((item) => (
                        <div key={item.symbol} className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-ink">{item.symbol}</p>
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          </div>
                          <p className="mt-2 text-lg text-ink">{formatCurrency(item.amount, tradeInput.fiat)}</p>
                          <p className="text-xs text-muted">{item.percent}% allocation</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="space-y-6">
                <Panel>
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-aqua" />
                    <h3 className="text-lg text-ink">DCA growth model</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Recurring amount">
                      <TextInput
                        type="number"
                        value={dcaInput.recurringAmount}
                        onChange={(event) => setDcaInput((current) => ({ ...current, recurringAmount: Number(event.target.value) }))}
                      />
                    </Field>
                    <Field label="Starting price">
                      <TextInput
                        type="number"
                        value={dcaInput.startingPrice}
                        onChange={(event) => setDcaInput((current) => ({ ...current, startingPrice: Number(event.target.value) }))}
                      />
                    </Field>
                    <Field label="Frequency">
                      <Select
                        value={dcaInput.frequency}
                        onChange={(event) => setDcaInput((current) => ({ ...current, frequency: event.target.value as typeof dcaInput.frequency }))}
                      >
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Bi-weekly</option>
                        <option value="monthly">Monthly</option>
                      </Select>
                    </Field>
                    <Field label="Periods">
                      <TextInput
                        type="number"
                        value={dcaInput.periods}
                        onChange={(event) => setDcaInput((current) => ({ ...current, periods: Number(event.target.value) }))}
                      />
                    </Field>
                  </div>
                  <div className="mt-4">
                    <RangeField
                      label="Expected annual growth"
                      value={dcaInput.annualGrowthPercent}
                      min={-20}
                      max={80}
                      step={1}
                      suffix="%"
                      onChange={(value) => setDcaInput((current) => ({ ...current, annualGrowthPercent: value }))}
                    />
                  </div>
                  <div className="mt-5">
                    <DcaGrowthChart data={dcaSummary.series} currency={tradeInput.fiat} />
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <MetricTile label="Invested" value={formatCurrency(dcaSummary.totalInvested, tradeInput.fiat)} />
                    <MetricTile label="Final Value" value={formatCurrency(dcaSummary.finalValue, tradeInput.fiat)} />
                    <MetricTile
                      label="Average Cost"
                      value={formatCurrency(dcaSummary.averageCost, tradeInput.fiat)}
                      hint={formatPercent(dcaSummary.gainPercent)}
                      tone={dcaSummary.gain >= 0 ? "good" : "danger"}
                    />
                  </div>
                </Panel>

                <Panel>
                  <div className="mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gold" />
                    <h3 className="text-lg text-ink">Yield and staking estimator</h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Principal">
                      <TextInput
                        type="number"
                        value={stakingInput.principal}
                        onChange={(event) => setStakingInput((current) => ({ ...current, principal: Number(event.target.value) }))}
                      />
                    </Field>
                    <Field label="Duration months">
                      <TextInput
                        type="number"
                        value={stakingInput.durationMonths}
                        onChange={(event) => setStakingInput((current) => ({ ...current, durationMonths: Number(event.target.value) }))}
                      />
                    </Field>
                    <Field label="Compounding">
                      <Select
                        value={stakingInput.compounding}
                        onChange={(event) => setStakingInput((current) => ({ ...current, compounding: event.target.value as typeof stakingInput.compounding }))}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </Select>
                    </Field>
                    <Field label="APY">
                      <TextInput
                        type="number"
                        value={stakingInput.apyPercent}
                        onChange={(event) => setStakingInput((current) => ({ ...current, apyPercent: Number(event.target.value) }))}
                      />
                    </Field>
                  </div>
                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <MetricTile label="Final Balance" value={formatCurrency(stakingSummary.finalBalance, tradeInput.fiat)} />
                    <MetricTile label="Rewards" value={formatCurrency(stakingSummary.rewards, tradeInput.fiat)} />
                    <MetricTile label="Monthly income" value={formatCurrency(stakingSummary.monthlyIncome, tradeInput.fiat)} />
                  </div>
                </Panel>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <Panel>
                <div className="mb-4 flex items-center gap-2">
                  <FolderClock className="h-4 w-4 text-gold" />
                  <h3 className="text-lg text-ink">Saved history & export</h3>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <ActionButton variant="secondary" onClick={() => exportHistory("json")}>
                    Export JSON
                  </ActionButton>
                  <ActionButton variant="secondary" onClick={() => exportHistory("csv")}>
                    Export CSV
                  </ActionButton>
                </div>
                <div className="space-y-3">
                  {history.length ? history.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setTradeInput(entry.input)}
                      className="w-full rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-3 text-left transition hover:border-aqua/20 hover:bg-white/[0.06]"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-ink">{entry.label}</p>
                        <span className="text-xs text-muted">{relativeTime(entry.createdAt)}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        P/L {formatCurrency(entry.summary.pnl, entry.input.fiat)} | ROI {formatPercent(entry.summary.roiAfterFees)}
                      </p>
                    </button>
                  )) : (
                    <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-sm text-muted">
                      Save your first setup from the calculator hub to start building a local
                      decision archive.
                    </div>
                  )}
                </div>
              </Panel>

              <Panel>
                <div className="mb-4 flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-aqua" />
                  <h3 className="text-lg text-ink">Quick trade journal</h3>
                </div>
                <div className="grid gap-4">
                  <Field label="Headline">
                    <TextInput
                      value={journalHeadline}
                      onChange={(event) => setJournalHeadline(event.target.value)}
                      placeholder="Example: Why SOL only works above 224"
                    />
                  </Field>
                  <Field label="Reflection">
                    <TextArea
                      value={journalBody}
                      onChange={(event) => setJournalBody(event.target.value)}
                      placeholder="Capture the thesis, invalidation, scaling plan, and emotional bias."
                    />
                  </Field>
                  <ActionButton onClick={addJournalEntry}>Save journal note</ActionButton>
                </div>
                <div className="mt-5 space-y-3">
                  {journalEntries.map((entry) => (
                    <div key={entry.id} className="rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-ink">{entry.headline}</p>
                        <span className="text-xs text-muted">{relativeTime(entry.createdAt)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{entry.body}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </section>
          <section id="settings" className="space-y-6">
            <Panel>
              <SectionHeading
                eyebrow="Settings"
                title="Flexible AI provider routing"
                description="Paste a provider name, API key, custom base URL, and model. Keys stay in browser localStorage only for local convenience and should move behind a secure backend proxy in production."
              />

              <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
                <div className="space-y-4">
                  <Field label="Provider adapter">
                    <Select
                      value={aiSettings.providerType}
                      onChange={(event) =>
                        applyProviderPreset(event.target.value as AIProviderSettings["providerType"])
                      }
                    >
                      <option value="openai">OpenAI-compatible</option>
                      <option value="groq">Groq-compatible</option>
                      <option value="together">Together-compatible</option>
                      <option value="anthropic">Anthropic wrapper</option>
                      <option value="gemini">Gemini wrapper</option>
                      <option value="custom-openai">Custom OpenAI-compatible</option>
                    </Select>
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Provider name">
                      <TextInput
                        value={aiSettings.providerName}
                        onChange={(event) => setAiSettings((current) => ({ ...current, providerName: event.target.value }))}
                      />
                    </Field>
                    <Field label="Model">
                      <TextInput
                        value={aiSettings.model}
                        onChange={(event) => setAiSettings((current) => ({ ...current, model: event.target.value }))}
                      />
                    </Field>
                  </div>
                  <Field label="API key">
                    <TextInput
                      type="password"
                      value={aiSettings.apiKey}
                      onChange={(event) => setAiSettings((current) => ({ ...current, apiKey: event.target.value }))}
                      placeholder="Paste key locally for browser-side requests"
                    />
                  </Field>
                  <Field label="Base URL">
                    <TextInput
                      value={aiSettings.baseUrl}
                      onChange={(event) => setAiSettings((current) => ({ ...current, baseUrl: event.target.value }))}
                      placeholder="Optional. Use this for custom OpenAI-compatible endpoints."
                    />
                  </Field>
                  <RangeField
                    label="Temperature"
                    value={aiSettings.temperature}
                    min={0}
                    max={1.5}
                    step={0.1}
                    onChange={(value) => setAiSettings((current) => ({ ...current, temperature: value }))}
                  />
                </div>

                <div className="space-y-4">
                  <div className="rounded-[28px] border border-[rgba(244,180,95,0.18)] bg-[rgba(244,180,95,0.08)] p-5">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4 text-gold" />
                      <p className="text-sm text-ink">Local key warning</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      Browser-stored keys are for local demos and personal use only. For a
                      production deployment, move all AI requests to a backend proxy, store
                      secrets on the server, and return only sanitized responses to the client.
                    </p>
                  </div>
                  <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-aqua" />
                      <p className="text-sm text-ink">Provider notes</p>
                    </div>
                    <ul className="mt-3 space-y-3 text-sm leading-6 text-muted">
                      <li>OpenAI, Groq, Together, and custom endpoints use the same chat-completions abstraction.</li>
                      <li>Anthropic uses the Messages API wrapper with its required headers.</li>
                      <li>Gemini uses generateContent with the API key placed in the request URL.</li>
                    </ul>
                  </div>
                  <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                    <div className="flex items-center gap-2">
                      <Settings2 className="h-4 w-4 text-gold" />
                      <p className="text-sm text-ink">Quick controls</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <TogglePill enabled={demoMode} onToggle={() => setDemoMode((current) => !current)} label="Demo mode" />
                      <TogglePill enabled={focusMode} onToggle={() => setFocusMode((current) => !current)} label="Focus mode" />
                    </div>
                    <p className="mt-3 text-sm text-muted">
                      Keyboard shortcuts: press / to focus the assistant prompt and D to
                      toggle demo mode when you are not inside a form field.
                    </p>
                  </div>
                </div>
              </div>
            </Panel>
          </section>
          <section id="about" className="space-y-6">
            <Panel>
              <SectionHeading
                eyebrow="About"
                title="What this product is built for"
                description="Aether Ledger is designed for screenshot-ready demos, premium marketplace listings, and actual daily use by traders, beginners leveling up, and DeFi users managing risk."
              />

              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gold" />
                    <p className="text-sm text-ink">Use-case focus</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    Best for active traders, research-heavy beginners, and DeFi users who want
                    fast conversion math, structured downside planning, and AI summaries that
                    stay grounded in the inputs on screen.
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-aqua" />
                    <p className="text-sm text-ink">Disclaimer</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    This app is informational software. It does not provide legal, tax, or
                    financial advice and should not replace exchange data, broker statements,
                    or professional guidance.
                  </p>
                </div>
                <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-gold" />
                    <p className="text-sm text-ink">Architecture note</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    The AI layer is intentionally abstracted so you can keep the same UI and
                    move requests to an API route or external backend later with minimal
                    changes to the frontend.
                  </p>
                </div>
              </div>
            </Panel>
          </section>
        </main>
      </div>

      <div className="mobile-nav lg:hidden">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} type="button" onClick={() => jumpToSection(item.id)}>
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
