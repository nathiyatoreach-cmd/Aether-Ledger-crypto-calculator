export type ProviderType =
  | "openai"
  | "groq"
  | "together"
  | "custom-openai"
  | "anthropic"
  | "gemini";

export interface AssetDefinition {
  symbol: string;
  name: string;
  coingeckoId: string;
  accent: string;
  stablecoin?: boolean;
  category: string;
  demoPrice: number;
}

export interface FiatDefinition {
  code: string;
  symbol: string;
  name: string;
}

export interface TradeInput {
  asset: string;
  fiat: string;
  amount: number;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  sellPrice: number;
  feesPercent: number;
  slippagePercent: number;
  leverage: number;
}

export interface TradeSummary {
  effectiveQuantity: number;
  grossEntryCost: number;
  grossCurrentValue: number;
  grossExitValue: number;
  totalFees: number;
  slippageCost: number;
  totalCost: number;
  breakEvenPrice: number;
  currentValue: number;
  currentPnl: number;
  currentPnlPercent: number;
  netProceeds: number;
  pnl: number;
  pnlPercent: number;
  roiAfterFees: number;
  marginUsed: number;
  liquidationPrice: number;
}

export interface ScenarioRow {
  label: string;
  price: number;
  pnl: number;
  roi: number;
}

export interface ProjectionPoint {
  label: string;
  price: number;
  value: number;
  pnl: number;
}

export interface DcaInput {
  recurringAmount: number;
  frequency: "weekly" | "biweekly" | "monthly";
  periods: number;
  startingPrice: number;
  annualGrowthPercent: number;
}

export interface DcaPoint {
  step: string;
  invested: number;
  value: number;
  units: number;
  price: number;
}

export interface DcaSummary {
  totalInvested: number;
  totalUnits: number;
  averageCost: number;
  finalValue: number;
  gain: number;
  gainPercent: number;
  series: DcaPoint[];
}

export interface PortfolioAllocationItem {
  symbol: string;
  label: string;
  percent: number;
  color: string;
}

export interface PortfolioAllocationResult extends PortfolioAllocationItem {
  amount: number;
}

export interface StakingInput {
  principal: number;
  apyPercent: number;
  durationMonths: number;
  compounding: "daily" | "weekly" | "monthly";
}

export interface StakingSummary {
  finalBalance: number;
  rewards: number;
  monthlyIncome: number;
}

export interface RiskRewardInput {
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  accountSize: number;
  riskPercent: number;
}

export interface RiskRewardSummary {
  riskPerUnit: number;
  rewardPerUnit: number;
  ratio: number;
  capitalAtRisk: number;
  positionSize: number;
  upsideValue: number;
  downsideValue: number;
}

export interface TakeProfitPlannerInput {
  entryPrice: number;
  stopLoss: number;
  positionSize: number;
  target1: number;
  target2: number;
  target3: number;
}

export interface TakeProfitRow {
  label: string;
  targetPrice: number;
  gainPerUnit: number;
  grossValue: number;
}

export interface LiquidationInput {
  entryPrice: number;
  leverage: number;
  maintenanceMarginPercent: number;
  positionType: "long" | "short";
}

export interface TaxEstimateInput {
  gains: number;
  holdingMonths: number;
  estimatedTaxRate: number;
}

export interface TaxEstimateResult {
  taxAmount: number;
  effectiveRate: number;
  afterTaxGain: number;
}

export interface AIProviderSettings {
  providerType: ProviderType;
  providerName: string;
  model: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
}

export interface AssistantRequest {
  title: string;
  system: string;
  prompt: string;
}

export interface AssistantResult {
  content: string;
  providerUsed: string;
  mode: "live" | "demo";
}

export interface AssetPrice {
  symbol: string;
  values: Record<string, number>;
  change24h: number;
  source: "live" | "mock";
}

export interface MarketState {
  status: "idle" | "loading" | "ready" | "error";
  source: "live" | "mock";
  lastUpdated: string | null;
  message: string;
  prices: Record<string, AssetPrice>;
}

export interface HistoryEntry {
  id: string;
  label: string;
  createdAt: string;
  input: TradeInput;
  summary: TradeSummary;
}

export interface SnapshotEntry {
  id: string;
  createdAt: string;
  note: string;
  totalValue: number;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  headline: string;
  body: string;
}

export interface ParsedPrompt {
  asset?: string;
  fiat?: string;
  quantity?: number;
  amount?: number;
  buyPrice?: number;
  currentPrice?: number;
  sellPrice?: number;
  feesPercent?: number;
  slippagePercent?: number;
  leverage?: number;
}
