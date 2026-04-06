import {
  AIProviderSettings,
  AssetDefinition,
  DcaInput,
  FiatDefinition,
  JournalEntry,
  PortfolioAllocationItem,
  RiskRewardInput,
  StakingInput,
  TakeProfitPlannerInput,
  TaxEstimateInput,
  TradeInput
} from "@/lib/types";

export const APP_NAME = "Aether Ledger";
export const APP_TAGLINE = "AI Crypto Calculator";
export const APP_SUBTITLE =
  "A cinematic trade cockpit for fast scenario testing, DCA planning, portfolio balance, and plain-English AI guidance.";

export const CRYPTO_ASSETS: AssetDefinition[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    coingeckoId: "bitcoin",
    accent: "#f4b45f",
    category: "Store of value",
    demoPrice: 94320
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    coingeckoId: "ethereum",
    accent: "#8da7ff",
    category: "Smart contracts",
    demoPrice: 4890
  },
  {
    symbol: "SOL",
    name: "Solana",
    coingeckoId: "solana",
    accent: "#4bd7c7",
    category: "High throughput",
    demoPrice: 228
  },
  {
    symbol: "BNB",
    name: "BNB",
    coingeckoId: "binancecoin",
    accent: "#ffd166",
    category: "Exchange",
    demoPrice: 802
  },
  {
    symbol: "XRP",
    name: "XRP",
    coingeckoId: "ripple",
    accent: "#d7e2ff",
    category: "Payments",
    demoPrice: 1.78
  },
  {
    symbol: "ADA",
    name: "Cardano",
    coingeckoId: "cardano",
    accent: "#62a8ff",
    category: "Layer 1",
    demoPrice: 1.24
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    coingeckoId: "dogecoin",
    accent: "#f7cf6a",
    category: "Community",
    demoPrice: 0.36
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    coingeckoId: "avalanche-2",
    accent: "#ff8e8e",
    category: "Layer 1",
    demoPrice: 54.2
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    coingeckoId: "matic-network",
    accent: "#a491ff",
    category: "Scaling",
    demoPrice: 1.48
  },
  {
    symbol: "LTC",
    name: "Litecoin",
    coingeckoId: "litecoin",
    accent: "#c6d4e8",
    category: "Payments",
    demoPrice: 134
  },
  {
    symbol: "USDT",
    name: "Tether",
    coingeckoId: "tether",
    accent: "#38d39f",
    category: "Stablecoin",
    demoPrice: 1,
    stablecoin: true
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    coingeckoId: "usd-coin",
    accent: "#6bb7ff",
    category: "Stablecoin",
    demoPrice: 1,
    stablecoin: true
  }
];

export const FIAT_CURRENCIES: FiatDefinition[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "Pound Sterling" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" }
];

export const PROVIDER_PRESETS: Record<string, Partial<AIProviderSettings>> = {
  openai: {
    providerType: "openai",
    providerName: "OpenAI",
    model: "gpt-5-mini",
    baseUrl: "https://api.openai.com/v1"
  },
  groq: {
    providerType: "groq",
    providerName: "Groq",
    model: "llama-3.3-70b-versatile",
    baseUrl: "https://api.groq.com/openai/v1"
  },
  together: {
    providerType: "together",
    providerName: "Together",
    model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    baseUrl: "https://api.together.xyz/v1"
  },
  anthropic: {
    providerType: "anthropic",
    providerName: "Anthropic",
    model: "claude-3-7-sonnet-latest",
    baseUrl: "https://api.anthropic.com/v1"
  },
  gemini: {
    providerType: "gemini",
    providerName: "Google Gemini",
    model: "gemini-2.5-pro",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta"
  },
  "custom-openai": {
    providerType: "custom-openai",
    providerName: "Custom OpenAI-Compatible",
    model: "your-model-name",
    baseUrl: "https://your-openai-compatible-endpoint/v1"
  }
};

export const DEMO_TRADE_INPUT: TradeInput = {
  asset: "SOL",
  fiat: "USD",
  amount: 25000,
  quantity: 120,
  buyPrice: 182,
  currentPrice: 228,
  sellPrice: 268,
  feesPercent: 0.35,
  slippagePercent: 0.65,
  leverage: 3
};

export const DEMO_DCA_INPUT: DcaInput = {
  recurringAmount: 900,
  frequency: "weekly",
  periods: 24,
  startingPrice: 228,
  annualGrowthPercent: 18
};

export const DEMO_PORTFOLIO: PortfolioAllocationItem[] = [
  { symbol: "BTC", label: "Bitcoin", percent: 36, color: "#f4b45f" },
  { symbol: "ETH", label: "Ethereum", percent: 24, color: "#8da7ff" },
  { symbol: "SOL", label: "Solana", percent: 18, color: "#4bd7c7" },
  { symbol: "USDC", label: "USDC", percent: 12, color: "#6bb7ff" },
  { symbol: "AVAX", label: "Avalanche", percent: 10, color: "#ff8e8e" }
];

export const DEMO_STAKING_INPUT: StakingInput = {
  principal: 12000,
  apyPercent: 11.5,
  durationMonths: 18,
  compounding: "monthly"
};

export const DEMO_RISK_INPUT: RiskRewardInput = {
  entryPrice: 228,
  stopLoss: 208,
  takeProfit: 284,
  accountSize: 42000,
  riskPercent: 1.5
};

export const DEMO_TP_INPUT: TakeProfitPlannerInput = {
  entryPrice: 228,
  stopLoss: 208,
  positionSize: 120,
  target1: 248,
  target2: 268,
  target3: 294
};

export const DEMO_TAX_INPUT: TaxEstimateInput = {
  gains: 6840,
  holdingMonths: 7,
  estimatedTaxRate: 24
};

export const DEFAULT_AI_SETTINGS: AIProviderSettings = {
  providerType: "openai",
  providerName: "OpenAI-Compatible",
  model: "gpt-5-mini",
  apiKey: "",
  baseUrl: "https://api.openai.com/v1",
  temperature: 0.4
};

export const DEMO_ASSISTANT_PROMPT =
  "Long 120 SOL bought at 182. Current price is 228, target 268, 3x leverage, 0.35% fees and 0.65% slippage. Summarize the setup like a disciplined trading coach.";

export const DEMO_WATCHLIST = ["BTC", "ETH", "SOL", "AVAX", "USDT"];

export const DEMO_JOURNAL: JournalEntry[] = [
  {
    id: "journal-1",
    createdAt: "2026-04-05T09:12:00.000Z",
    headline: "SOL momentum thesis",
    body:
      "Breakout trade only stays valid if price reclaims 224 on sustained volume. I want to scale out into 248 and 268 rather than holding for a moonshot."
  }
];

export const NATURAL_LANGUAGE_EXAMPLES = [
  "Buy 1.8 ETH at 2440, current 2685, sell 2950, 10x leverage, 0.35% fees and 0.6% slippage",
  "I have $12000 in BTC bought at 88400 and want to sell at 96350",
  "Plan a SOL scalp: quantity 85, buy 221, current 228, stop 214, target 246"
];

export const STORAGE_KEYS = {
  appState: "helix-ledger-app-state",
  history: "helix-ledger-history",
  journal: "helix-ledger-journal"
};
