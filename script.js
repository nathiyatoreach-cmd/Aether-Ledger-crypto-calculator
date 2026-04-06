const STORAGE_KEYS = {
  ui: "helix-ledger-ui-v1",
  form: "helix-ledger-form-v1",
  provider: "helix-ledger-provider-v1",
  allocations: "helix-ledger-allocations-v1",
  history: "helix-ledger-history-v1",
  snapshots: "helix-ledger-snapshots-v1",
  journal: "helix-ledger-journal-v1",
};

const ASSETS = [
  { symbol: "BTC", name: "Bitcoin", id: "bitcoin", color: "#f7931a", demoUsd: 68420, demoChange: 2.64 },
  { symbol: "ETH", name: "Ethereum", id: "ethereum", color: "#627eea", demoUsd: 3348, demoChange: 3.18 },
  { symbol: "SOL", name: "Solana", id: "solana", color: "#18d3b5", demoUsd: 182.4, demoChange: 5.78 },
  { symbol: "BNB", name: "BNB", id: "binancecoin", color: "#f3ba2f", demoUsd: 612.8, demoChange: 1.84 },
  { symbol: "XRP", name: "XRP", id: "ripple", color: "#76a9ff", demoUsd: 0.71, demoChange: -0.94 },
  { symbol: "ADA", name: "Cardano", id: "cardano", color: "#3cc8ff", demoUsd: 0.64, demoChange: 2.09 },
  { symbol: "DOGE", name: "Dogecoin", id: "dogecoin", color: "#c3a633", demoUsd: 0.18, demoChange: 4.02 },
  { symbol: "AVAX", name: "Avalanche", id: "avalanche-2", color: "#ff6b7a", demoUsd: 41.8, demoChange: 3.41 },
  { symbol: "MATIC", name: "Polygon", id: "matic-network", color: "#8247e5", demoUsd: 0.92, demoChange: 1.37 },
  { symbol: "LTC", name: "Litecoin", id: "litecoin", color: "#b8c7d9", demoUsd: 92.5, demoChange: 0.62 },
  { symbol: "USDC", name: "USD Coin", id: "usd-coin", color: "#2775ca", demoUsd: 1, demoChange: 0.02 },
  { symbol: "USDT", name: "Tether", id: "tether", color: "#26a17b", demoUsd: 1, demoChange: 0.01 },
  { symbol: "DAI", name: "Dai", id: "dai", color: "#f5ac37", demoUsd: 1, demoChange: 0.01 },
];

const FIATS = [
  { code: "USD", symbol: "$", rate: 1 },
  { code: "AUD", symbol: "A$", rate: 1.53 },
  { code: "EUR", symbol: "EUR", rate: 0.92 },
  { code: "GBP", symbol: "GBP", rate: 0.79 },
  { code: "JPY", symbol: "JPY", rate: 151 },
  { code: "SGD", symbol: "S$", rate: 1.35 },
];

const PROVIDER_DEFAULTS = {
  openai: {
    name: "OpenAI",
    model: "gpt-4.1-mini",
    baseUrl: "https://api.openai.com/v1",
  },
  groq: {
    name: "Groq",
    model: "llama-3.3-70b-versatile",
    baseUrl: "https://api.groq.com/openai/v1",
  },
  together: {
    name: "Together",
    model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
    baseUrl: "https://api.together.xyz/v1",
  },
  anthropic: {
    name: "Anthropic",
    model: "claude-3-5-sonnet-latest",
    baseUrl: "https://api.anthropic.com/v1/messages",
  },
  gemini: {
    name: "Google Gemini",
    model: "gemini-1.5-flash",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
  },
  "custom-openai": {
    name: "Custom endpoint",
    model: "gpt-4.1-mini",
    baseUrl: "",
  },
};

const DEFAULT_ALLOCATIONS = [
  { symbol: "BTC", pct: 34 },
  { symbol: "ETH", pct: 26 },
  { symbol: "SOL", pct: 15 },
  { symbol: "AVAX", pct: 10 },
  { symbol: "USDC", pct: 10 },
  { symbol: "MATIC", pct: 5 },
];

const DEFAULT_FORM = {
  assetSelect: "BTC",
  fiatSelect: "USD",
  amountInput: "12500",
  quantityInput: "0.1969",
  buyPriceInput: "63500",
  currentPriceInput: "68420",
  sellPriceInput: "74800",
  feesInput: "0.35",
  slippageInput: "0.65",
  leverageInput: "3",
  riskEntryInput: "68420",
  riskStopInput: "65100",
  riskTakeInput: "74800",
  riskAccountInput: "42000",
  riskPercentInput: "1.5",
  tpSizeInput: "0.1969",
  tpEntryInput: "63500",
  tp1Input: "70500",
  tp2Input: "74800",
  tp3Input: "79600",
  maintenanceInput: "0.6",
  taxGainsInput: "6800",
  taxMonthsInput: "13",
  taxRateInput: "24",
  assistantPrompt:
    "I bought 0.1969 BTC at 63,500 USD, current spot is 68,420, and I want to sell near 74,800 with 0.35% fees, 0.65% slippage, and 3x leverage. Explain the setup in plain English.",
  portfolioValueInput: "32000",
  dcaRecurringInput: "600",
  dcaPriceInput: "3150",
  dcaFrequencyInput: "weekly",
  dcaPeriodsInput: "26",
  dcaGrowthInput: "18",
  stakingPrincipalInput: "12000",
  stakingMonthsInput: "18",
  stakingCompoundingInput: "daily",
  stakingApyInput: "8.6",
};

const DEMO_PRESETS = [
  {
    id: "btc-breakout",
    tag: "Momentum",
    title: "BTC Breakout Ladder",
    copy: "High-conviction swing structure with tight fees and defined exits.",
    prompt:
      "Deploy 12,500 USD into BTC at 63,500. Spot is 68,420, target 74,800, fees 0.35%, slippage 0.65%, leverage 3x. Give me the trade summary.",
    values: {
      assetSelect: "BTC",
      fiatSelect: "USD",
      amountInput: "12500",
      quantityInput: "0.1969",
      buyPriceInput: "63500",
      currentPriceInput: "68420",
      sellPriceInput: "74800",
      feesInput: "0.35",
      slippageInput: "0.65",
      leverageInput: "3",
      riskEntryInput: "68420",
      riskStopInput: "65100",
      riskTakeInput: "74800",
      tpSizeInput: "0.1969",
      tpEntryInput: "63500",
      tp1Input: "70500",
      tp2Input: "74800",
      tp3Input: "79600",
      taxGainsInput: "6800",
      taxMonthsInput: "13",
      assistantPrompt:
        "I bought 0.1969 BTC at 63,500 USD, current spot is 68,420, and I want to sell near 74,800 with 0.35% fees, 0.65% slippage, and 3x leverage. Explain the setup in plain English.",
    },
  },
  {
    id: "eth-core",
    tag: "Core Trade",
    title: "ETH Rotation Plan",
    copy: "A cleaner mid-cap setup with yield-minded follow-through.",
    prompt:
      "I am buying 4.2 ETH at 3,120, current is 3,348, first target 3,520, fees 0.25%, slippage 0.4%, leverage 2x. Compare my base and bull scenarios.",
    values: {
      assetSelect: "ETH",
      fiatSelect: "USD",
      amountInput: "13104",
      quantityInput: "4.2",
      buyPriceInput: "3120",
      currentPriceInput: "3348",
      sellPriceInput: "3520",
      feesInput: "0.25",
      slippageInput: "0.4",
      leverageInput: "2",
      riskEntryInput: "3348",
      riskStopInput: "3160",
      riskTakeInput: "3520",
      tpSizeInput: "4.2",
      tpEntryInput: "3120",
      tp1Input: "3420",
      tp2Input: "3520",
      tp3Input: "3710",
      taxGainsInput: "4200",
      taxMonthsInput: "9",
      assistantPrompt:
        "I am buying 4.2 ETH at 3,120, current is 3,348, first target 3,520, fees 0.25%, slippage 0.4%, leverage 2x. Compare my base and bull scenarios.",
    },
  },
  {
    id: "sol-sprint",
    tag: "Breakout",
    title: "SOL Sprint Setup",
    copy: "Faster upside with wider volatility and a more defensive stop.",
    prompt:
      "Bought 82 SOL at 168, spot 182.4, target 214, stop 159, slippage 0.9%, fees 0.3%, leverage 4x. Give me risk notes.",
    values: {
      assetSelect: "SOL",
      fiatSelect: "USD",
      amountInput: "13776",
      quantityInput: "82",
      buyPriceInput: "168",
      currentPriceInput: "182.4",
      sellPriceInput: "214",
      feesInput: "0.3",
      slippageInput: "0.9",
      leverageInput: "4",
      riskEntryInput: "182.4",
      riskStopInput: "159",
      riskTakeInput: "214",
      tpSizeInput: "82",
      tpEntryInput: "168",
      tp1Input: "192",
      tp2Input: "214",
      tp3Input: "236",
      taxGainsInput: "8800",
      taxMonthsInput: "5",
      assistantPrompt:
        "Bought 82 SOL at 168, spot 182.4, target 214, stop 159, slippage 0.9%, fees 0.3%, leverage 4x. Give me risk notes.",
    },
  },
  {
    id: "avax-range",
    tag: "Range",
    title: "AVAX Range Reclaim",
    copy: "Range-trade template with smaller size and stronger cash buffer.",
    prompt:
      "I want to trade AVAX from 38.5 to 46.2 using 7,000 USD, 0.4% fees, 0.6% slippage, and 2x leverage. Parse it and auto-fill the calculator.",
    values: {
      assetSelect: "AVAX",
      fiatSelect: "USD",
      amountInput: "7000",
      quantityInput: "181.8182",
      buyPriceInput: "38.5",
      currentPriceInput: "41.8",
      sellPriceInput: "46.2",
      feesInput: "0.4",
      slippageInput: "0.6",
      leverageInput: "2",
      riskEntryInput: "41.8",
      riskStopInput: "37.2",
      riskTakeInput: "46.2",
      tpSizeInput: "181.8182",
      tpEntryInput: "38.5",
      tp1Input: "42.4",
      tp2Input: "46.2",
      tp3Input: "49.6",
      taxGainsInput: "3100",
      taxMonthsInput: "11",
      assistantPrompt:
        "I want to trade AVAX from 38.5 to 46.2 using 7,000 USD, 0.4% fees, 0.6% slippage, and 2x leverage. Parse it and auto-fill the calculator.",
    },
  },
];

const EXAMPLE_PROMPTS = [
  "Buy 0.65 ETH at 3150, spot is 3348, sell at 3600, fees 0.35%, slippage 0.5%, leverage 3x.",
  "Use 7000 USD to buy AVAX at 38.5 and target 46.2 with 2x leverage and 0.6% slippage.",
  "I bought 82 SOL at 168, stop 159, target 214. How risky is this trade?",
  "Summarize my portfolio and tell me if my stablecoin buffer is healthy.",
];

const ASSET_MAP = Object.fromEntries(ASSETS.map((asset) => [asset.symbol, asset]));
const FIAT_MAP = Object.fromEntries(FIATS.map((fiat) => [fiat.code, fiat]));

const state = {
  demoMode: true,
  focusMode: false,
  liquidationSide: "long",
  activePreset: DEMO_PRESETS[0].id,
  marketPricesUsd: Object.fromEntries(ASSETS.map((asset) => [asset.symbol, asset.demoUsd])),
  marketChanges: Object.fromEntries(ASSETS.map((asset) => [asset.symbol, asset.demoChange])),
  marketStatus: "mock",
  marketMessage:
    "Using curated demo pricing until a live CoinGecko response is available.",
  marketUpdatedAt: "",
  history: [],
  snapshots: [],
  journal: [],
  allocations: DEFAULT_ALLOCATIONS.map((item) => ({ ...item })),
  provider: {
    type: "openai",
    name: PROVIDER_DEFAULTS.openai.name,
    model: PROVIDER_DEFAULTS.openai.model,
    apiKey: "",
    baseUrl: PROVIDER_DEFAULTS.openai.baseUrl,
    temperature: 0.4,
  },
  computed: {
    trade: null,
    risk: null,
    tp: null,
    liquidation: null,
    tax: null,
    allocation: null,
    dca: null,
    staking: null,
  },
};

const refs = {};

const FORM_FIELD_IDS = [
  "assetSelect",
  "fiatSelect",
  "amountInput",
  "quantityInput",
  "buyPriceInput",
  "currentPriceInput",
  "sellPriceInput",
  "feesInput",
  "slippageInput",
  "leverageInput",
  "riskEntryInput",
  "riskStopInput",
  "riskTakeInput",
  "riskAccountInput",
  "riskPercentInput",
  "tpSizeInput",
  "tpEntryInput",
  "tp1Input",
  "tp2Input",
  "tp3Input",
  "maintenanceInput",
  "taxGainsInput",
  "taxMonthsInput",
  "taxRateInput",
  "assistantPrompt",
  "portfolioValueInput",
  "dcaRecurringInput",
  "dcaPriceInput",
  "dcaFrequencyInput",
  "dcaPeriodsInput",
  "dcaGrowthInput",
  "stakingPrincipalInput",
  "stakingMonthsInput",
  "stakingCompoundingInput",
  "stakingApyInput",
];

function safeLoad(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeStore(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

function toNumber(value, fallback = 0) {
  const cleaned = String(value ?? "")
    .replace(/,/g, "")
    .trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function timestampLabel(input = new Date()) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(input);
}

function signedPercent(value, digits = 2) {
  const numeric = Number.isFinite(value) ? value : 0;
  const sign = numeric > 0 ? "+" : "";
  return `${sign}${numeric.toFixed(digits)}%`;
}

function formatPercent(value, digits = 2) {
  const numeric = Number.isFinite(value) ? value : 0;
  return `${numeric.toFixed(digits)}%`;
}

function formatNumber(value, digits = 4) {
  const numeric = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(numeric);
}

function formatCompact(value) {
  const numeric = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(numeric);
}

function formatCurrency(value, fiat = "USD") {
  const numeric = Number.isFinite(value) ? value : 0;
  const digits = fiat === "JPY" ? 0 : Math.abs(numeric) < 10 ? 4 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: fiat,
    minimumFractionDigits: fiat === "JPY" ? 0 : Math.min(digits, 2),
    maximumFractionDigits: digits,
  }).format(numeric);
}

function providerLabel(type) {
  return PROVIDER_DEFAULTS[type]?.name ?? "Custom provider";
}

function getActiveProviderConfig() {
  return {
    type: refs.providerTypeInput.value,
    name: refs.providerNameInput.value.trim() || providerLabel(refs.providerTypeInput.value),
    model:
      refs.providerModelInput.value.trim() ||
      PROVIDER_DEFAULTS[refs.providerTypeInput.value]?.model ||
      "custom-model",
    apiKey: refs.providerKeyInput.value.trim(),
    baseUrl:
      refs.providerBaseUrlInput.value.trim() ||
      PROVIDER_DEFAULTS[refs.providerTypeInput.value]?.baseUrl ||
      "",
    temperature: clamp(toNumber(refs.temperatureInput.value, 0.4), 0, 1.5),
  };
}

function populateSelect(select, items, getValue, getLabel) {
  select.innerHTML = items
    .map((item) => `<option value="${getValue(item)}">${escapeHtml(getLabel(item))}</option>`)
    .join("");
}

function cacheRefs() {
  const ids = [
    "watchlistSource",
    "watchlistList",
    "demoBadge",
    "assistantBadge",
    "marketBadge",
    "heroMetrics",
    "presetGrid",
    "projectionChart",
    "assistantPreview",
    "marketMessage",
    "marketRibbon",
    "marketUpdated",
    "scenarioChart",
    "assetSelect",
    "fiatSelect",
    "amountInput",
    "quantityInput",
    "buyPriceInput",
    "currentPriceInput",
    "sellPriceInput",
    "liveSpotDisplay",
    "feesValue",
    "feesInput",
    "slippageValue",
    "slippageInput",
    "leverageValue",
    "leverageInput",
    "tradeMetrics",
    "riskEntryInput",
    "riskStopInput",
    "riskTakeInput",
    "riskAccountInput",
    "riskPercentValue",
    "riskPercentInput",
    "riskMetrics",
    "tpSizeInput",
    "tpEntryInput",
    "tp1Input",
    "tp2Input",
    "tp3Input",
    "tpRows",
    "maintenanceValue",
    "maintenanceInput",
    "liquidationOutput",
    "taxGainsInput",
    "taxMonthsInput",
    "taxRateValue",
    "taxRateInput",
    "taxMetrics",
    "assistantProviderBadge",
    "assistantPrompt",
    "exampleChips",
    "assistantMeta",
    "assistantModeBadge",
    "assistantOutput",
    "portfolioValueInput",
    "allocationInputs",
    "allocationTotal",
    "snapshotList",
    "allocationDonut",
    "allocationLegend",
    "allocationAmounts",
    "dcaRecurringInput",
    "dcaPriceInput",
    "dcaFrequencyInput",
    "dcaPeriodsInput",
    "dcaGrowthValue",
    "dcaGrowthInput",
    "dcaChart",
    "dcaMetrics",
    "stakingPrincipalInput",
    "stakingMonthsInput",
    "stakingCompoundingInput",
    "stakingApyInput",
    "stakingMetrics",
    "historyList",
    "journalHeadlineInput",
    "journalBodyInput",
    "journalList",
    "providerTypeInput",
    "providerNameInput",
    "providerModelInput",
    "providerKeyInput",
    "providerBaseUrlInput",
    "temperatureValue",
    "temperatureInput",
  ];

  ids.forEach((id) => {
    refs[id] = document.getElementById(id);
  });
}

function createDemoHistory() {
  return [
    {
      id: uid("history"),
      label: "BTC swing saved",
      createdAt: timestampLabel(new Date(Date.now() - 1000 * 60 * 35)),
      asset: "BTC",
      fiat: "USD",
      quantity: 0.1969,
      buyPrice: 63500,
      currentPrice: 68420,
      sellPrice: 74800,
      fees: 0.35,
      slippage: 0.65,
      leverage: 3,
      amount: 12500,
      targetReturn: 2063,
    },
    {
      id: uid("history"),
      label: "SOL breakout saved",
      createdAt: timestampLabel(new Date(Date.now() - 1000 * 60 * 110)),
      asset: "SOL",
      fiat: "USD",
      quantity: 82,
      buyPrice: 168,
      currentPrice: 182.4,
      sellPrice: 214,
      fees: 0.3,
      slippage: 0.9,
      leverage: 4,
      amount: 13776,
      targetReturn: 3258,
    },
  ];
}

function createDemoSnapshots() {
  return [
    {
      id: uid("snapshot"),
      createdAt: timestampLabel(new Date(Date.now() - 1000 * 60 * 52)),
      total: 32000,
      allocations: DEFAULT_ALLOCATIONS.map((item) => ({ ...item })),
    },
  ];
}

function createDemoJournal() {
  return [
    {
      id: uid("journal"),
      headline: "Stayed patient on the BTC reclaim",
      body:
        "Waited for confirmation above the previous range high instead of chasing. Fees stayed controlled and the break-even level remained clearly below spot.",
      createdAt: timestampLabel(new Date(Date.now() - 1000 * 60 * 88)),
    },
  ];
}

function loadPersistedState() {
  const ui = safeLoad(STORAGE_KEYS.ui, null);
  const form = safeLoad(STORAGE_KEYS.form, null);
  const provider = safeLoad(STORAGE_KEYS.provider, null);
  const allocations = safeLoad(STORAGE_KEYS.allocations, null);

  state.demoMode = ui?.demoMode ?? true;
  state.focusMode = ui?.focusMode ?? false;
  state.liquidationSide = ui?.liquidationSide ?? "long";
  state.activePreset = ui?.activePreset ?? DEMO_PRESETS[0].id;

  state.provider = {
    ...state.provider,
    ...(provider ?? {}),
  };

  state.allocations =
    Array.isArray(allocations) && allocations.length
      ? allocations.map((entry) => ({
          symbol: entry.symbol,
          pct: toNumber(entry.pct, 0),
        }))
      : DEFAULT_ALLOCATIONS.map((item) => ({ ...item }));

  state.history = safeLoad(STORAGE_KEYS.history, createDemoHistory());
  state.snapshots = safeLoad(STORAGE_KEYS.snapshots, createDemoSnapshots());
  state.journal = safeLoad(STORAGE_KEYS.journal, createDemoJournal());

  return form;
}

function applyFormValues(savedForm) {
  const source = { ...DEFAULT_FORM, ...(savedForm ?? {}) };

  FORM_FIELD_IDS.forEach((id) => {
    if (!refs[id] || source[id] === undefined) {
      return;
    }
    refs[id].value = source[id];
  });

  refs.providerTypeInput.value = state.provider.type;
  refs.providerNameInput.value = state.provider.name;
  refs.providerModelInput.value = state.provider.model;
  refs.providerKeyInput.value = state.provider.apiKey;
  refs.providerBaseUrlInput.value = state.provider.baseUrl;
  refs.temperatureInput.value = String(state.provider.temperature);
}

function persistUiState() {
  safeStore(STORAGE_KEYS.ui, {
    demoMode: state.demoMode,
    focusMode: state.focusMode,
    liquidationSide: state.liquidationSide,
    activePreset: state.activePreset,
  });
}

function persistProviderState() {
  state.provider = getActiveProviderConfig();
  safeStore(STORAGE_KEYS.provider, state.provider);
}

function persistFormState() {
  const payload = {};
  FORM_FIELD_IDS.forEach((id) => {
    if (refs[id]) {
      payload[id] = refs[id].value;
    }
  });
  safeStore(STORAGE_KEYS.form, payload);
}

function persistAllocations() {
  safeStore(STORAGE_KEYS.allocations, state.allocations);
}

function persistCollections() {
  safeStore(STORAGE_KEYS.history, state.history);
  safeStore(STORAGE_KEYS.snapshots, state.snapshots);
  safeStore(STORAGE_KEYS.journal, state.journal);
}

function getSelectedAsset() {
  return refs.assetSelect.value || DEFAULT_FORM.assetSelect;
}

function getSelectedFiat() {
  return refs.fiatSelect.value || DEFAULT_FORM.fiatSelect;
}

function getFiatRate(code) {
  return FIAT_MAP[code]?.rate ?? 1;
}

function getSpotPrice(symbol, fiat = getSelectedFiat()) {
  const usdPrice = state.marketPricesUsd[symbol] ?? ASSET_MAP[symbol]?.demoUsd ?? 0;
  return usdPrice * getFiatRate(fiat);
}

function getMarketChange(symbol) {
  return state.marketChanges[symbol] ?? ASSET_MAP[symbol]?.demoChange ?? 0;
}

function renderPresetGrid() {
  refs.presetGrid.innerHTML = DEMO_PRESETS.map((preset) => {
    const isActive = preset.id === state.activePreset;
    return `
      <button
        type="button"
        class="preset-card"
        data-preset-id="${preset.id}"
        style="${isActive ? "border-color: rgba(75, 215, 199, 0.35); background: rgba(75, 215, 199, 0.08);" : ""}"
      >
        <p>${escapeHtml(preset.tag)}</p>
        <strong>${escapeHtml(preset.title)}</strong>
        <small>${escapeHtml(preset.copy)}</small>
      </button>
    `;
  }).join("");
}

function renderExampleChips() {
  refs.exampleChips.innerHTML = EXAMPLE_PROMPTS.map(
    (prompt) => `
      <button type="button" data-chip-prompt="${escapeHtml(prompt)}">
        ${escapeHtml(prompt)}
      </button>
    `,
  ).join("");
}

function renderAllocationInputs() {
  refs.allocationInputs.innerHTML = state.allocations
    .map((entry) => {
      const asset = ASSET_MAP[entry.symbol];
      return `
        <label>
          <span>${escapeHtml(asset.symbol)} | ${escapeHtml(asset.name)}</span>
          <input type="number" min="0" max="100" step="0.1" data-allocation-symbol="${asset.symbol}" value="${entry.pct}" />
        </label>
      `;
    })
    .join("");
}

function syncRangeLabels() {
  refs.feesValue.textContent = `${toNumber(refs.feesInput.value).toFixed(2)}%`;
  refs.slippageValue.textContent = `${toNumber(refs.slippageInput.value).toFixed(2)}%`;
  refs.leverageValue.textContent = `${toNumber(refs.leverageInput.value, 1).toFixed(0)}x`;
  refs.riskPercentValue.textContent = `${toNumber(refs.riskPercentInput.value).toFixed(2)}%`;
  refs.maintenanceValue.textContent = `${toNumber(refs.maintenanceInput.value).toFixed(1)}%`;
  refs.taxRateValue.textContent = `${toNumber(refs.taxRateInput.value).toFixed(0)}%`;
  refs.dcaGrowthValue.textContent = `${toNumber(refs.dcaGrowthInput.value).toFixed(0)}%`;
  refs.temperatureValue.textContent = toNumber(refs.temperatureInput.value, 0.4).toFixed(1);
}

function renderMetricCards(container, metrics) {
  container.innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric-card">
          <p>${escapeHtml(metric.label)}</p>
          <strong class="${metric.tone ?? ""}">${escapeHtml(metric.value)}</strong>
          <small>${escapeHtml(metric.note)}</small>
        </article>
      `,
    )
    .join("");
}

function renderMiniMetrics(container, metrics) {
  container.innerHTML = metrics
    .map(
      (metric) => `
        <article class="mini-metric">
          <p>${escapeHtml(metric.label)}</p>
          <strong class="${metric.tone ?? ""}">${escapeHtml(metric.value)}</strong>
          <small>${escapeHtml(metric.note)}</small>
        </article>
      `,
    )
    .join("");
}

function calculateTrade() {
  const asset = getSelectedAsset();
  const fiat = getSelectedFiat();
  const liveSpot = getSpotPrice(asset, fiat);

  let buyPrice = toNumber(refs.buyPriceInput.value, liveSpot || 0);
  let currentPrice = toNumber(refs.currentPriceInput.value, liveSpot || buyPrice);
  let sellPrice = toNumber(refs.sellPriceInput.value, currentPrice || buyPrice);
  let quantity = toNumber(refs.quantityInput.value, 0);
  let amount = toNumber(refs.amountInput.value, 0);

  if (buyPrice <= 0) {
    buyPrice = liveSpot || 0;
  }
  if (currentPrice <= 0) {
    currentPrice = liveSpot || buyPrice;
  }
  if (sellPrice <= 0) {
    sellPrice = currentPrice || buyPrice;
  }
  if (quantity <= 0 && amount > 0 && buyPrice > 0) {
    quantity = amount / buyPrice;
  }
  if (amount <= 0 && quantity > 0 && buyPrice > 0) {
    amount = quantity * buyPrice;
  }

  const feeRate = clamp(toNumber(refs.feesInput.value) / 100, 0, 0.25);
  const slippageRate = clamp(toNumber(refs.slippageInput.value) / 100, 0, 0.5);
  const leverage = clamp(toNumber(refs.leverageInput.value, 1), 1, 20);

  const entryGross = quantity * buyPrice;
  const entryFees = entryGross * feeRate;
  const investedCapital = entryGross + entryFees;
  const currentValue = quantity * currentPrice;
  const currentExitDrag = currentValue * (feeRate + slippageRate);
  const currentNetValue = currentValue - currentExitDrag;
  const profitLoss = currentNetValue - investedCapital;
  const profitLossPct = investedCapital > 0 ? (profitLoss / investedCapital) * 100 : 0;
  const breakEvenPrice =
    quantity > 0 && 1 - feeRate - slippageRate > 0
      ? investedCapital / (quantity * (1 - feeRate - slippageRate))
      : 0;
  const sellGross = quantity * sellPrice;
  const sellFees = sellGross * feeRate;
  const sellSlippage = sellGross * slippageRate;
  const totalFees = entryFees + sellFees + sellSlippage;
  const netProceeds = sellGross - sellFees - sellSlippage;
  const returnAfterFees = netProceeds - investedCapital;
  const exposure = currentValue;
  const marginUsed = leverage > 0 ? exposure / leverage : exposure;

  refs.liveSpotDisplay.value = liveSpot > 0 ? formatCurrency(liveSpot, fiat) : "Unavailable";

  return {
    asset,
    fiat,
    liveSpot,
    amount,
    quantity,
    buyPrice,
    currentPrice,
    sellPrice,
    feeRate,
    slippageRate,
    leverage,
    entryGross,
    entryFees,
    investedCapital,
    currentValue,
    currentNetValue,
    profitLoss,
    profitLossPct,
    breakEvenPrice,
    totalFees,
    netProceeds,
    returnAfterFees,
    exposure,
    marginUsed,
  };
}

function calculateRisk(trade) {
  const entry = toNumber(refs.riskEntryInput.value, trade.currentPrice || trade.buyPrice);
  const stop = toNumber(refs.riskStopInput.value, entry * 0.95);
  const take = toNumber(refs.riskTakeInput.value, trade.sellPrice);
  const accountSize = Math.max(toNumber(refs.riskAccountInput.value, trade.amount * 3), 0);
  const riskPercent = clamp(toNumber(refs.riskPercentInput.value, 1.5), 0.1, 25);
  const allowedRisk = accountSize * (riskPercent / 100);
  const riskPerUnit = Math.abs(entry - stop);
  const rewardPerUnit = Math.abs(take - entry);
  const units = riskPerUnit > 0 ? allowedRisk / riskPerUnit : 0;
  const notional = units * entry;
  const rewardValue = rewardPerUnit * units;
  const rr = riskPerUnit > 0 ? rewardPerUnit / riskPerUnit : 0;
  const stopDistancePct = entry > 0 ? (Math.abs(entry - stop) / entry) * 100 : 0;

  return {
    entry,
    stop,
    take,
    accountSize,
    riskPercent,
    allowedRisk,
    riskPerUnit,
    rewardPerUnit,
    units,
    notional,
    rewardValue,
    rr,
    stopDistancePct,
  };
}

function calculateTakeProfit(trade) {
  const size = Math.max(toNumber(refs.tpSizeInput.value, trade.quantity), 0);
  const entry = Math.max(toNumber(refs.tpEntryInput.value, trade.buyPrice), 0);
  const feeRate = trade.feeRate;
  const slippageRate = trade.slippageRate;
  const targets = [
    { label: "Target 1", price: toNumber(refs.tp1Input.value, trade.currentPrice * 1.03) },
    { label: "Target 2", price: toNumber(refs.tp2Input.value, trade.sellPrice) },
    { label: "Target 3", price: toNumber(refs.tp3Input.value, trade.sellPrice * 1.08) },
  ];

  return targets.map((target, index) => {
    const allocation = index < 2 ? 0.3 : 0.4;
    const qty = size * allocation;
    const gross = qty * target.price;
    const net = gross * (1 - feeRate - slippageRate);
    const cost = qty * entry * (1 + feeRate);
    const pnl = net - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    return {
      ...target,
      qty,
      gross,
      net,
      pnl,
      pnlPct,
      allocation,
    };
  });
}

function calculateLiquidation(trade) {
  const mmr = clamp(toNumber(refs.maintenanceInput.value, 0.6) / 100, 0.001, 0.5);
  const entry = Math.max(trade.buyPrice || trade.currentPrice, 0);
  const leverage = Math.max(trade.leverage, 1);

  let price = 0;
  if (state.liquidationSide === "long") {
    price = entry * (1 - 1 / leverage + mmr);
  } else {
    price = entry * (1 + 1 / leverage - mmr);
  }

  const current = trade.currentPrice;
  const bufferPct = current > 0 ? (Math.abs(current - price) / current) * 100 : 0;
  return {
    mmr,
    entry,
    leverage,
    side: state.liquidationSide,
    price: Math.max(price, 0),
    bufferPct,
  };
}

function calculateTax(trade) {
  const gains = Math.max(toNumber(refs.taxGainsInput.value, Math.max(trade.returnAfterFees, 0)), 0);
  const months = Math.max(toNumber(refs.taxMonthsInput.value, 12), 0);
  const rate = clamp(toNumber(refs.taxRateInput.value, 24), 0, 80) / 100;
  const discount = months >= 12 ? 0.5 : 0;
  const taxableGain = gains * (1 - discount);
  const taxDue = taxableGain * rate;
  const afterTax = gains - taxDue;
  return {
    gains,
    months,
    rate,
    discount,
    taxableGain,
    taxDue,
    afterTax,
  };
}

function readAllocations() {
  const allocationInputs = refs.allocationInputs.querySelectorAll("[data-allocation-symbol]");
  state.allocations = Array.from(allocationInputs).map((input) => ({
    symbol: input.dataset.allocationSymbol,
    pct: clamp(toNumber(input.value, 0), 0, 100),
  }));
  persistAllocations();
  return state.allocations;
}

function calculateAllocation() {
  const raw = readAllocations();
  const totalValue = Math.max(toNumber(refs.portfolioValueInput.value, 0), 0);
  const sum = raw.reduce((accumulator, item) => accumulator + item.pct, 0);
  const slices = raw.map((item) => ({ ...item }));

  if (sum > 0 && sum < 100) {
    slices.push({ symbol: "CASH", pct: 100 - sum, color: "#5b6878", name: "Cash Buffer" });
  }

  const normalizedBase = slices.reduce((accumulator, item) => accumulator + item.pct, 0) || 1;
  const normalized = slices.map((slice) => {
    const asset = ASSET_MAP[slice.symbol];
    const pct = (slice.pct / normalizedBase) * 100;
    return {
      symbol: slice.symbol,
      name: slice.name ?? asset?.name ?? slice.symbol,
      color: slice.color ?? asset?.color ?? "#5b6878",
      pct,
      originalPct: slice.pct,
      amount: totalValue * (pct / 100),
    };
  });

  return {
    totalValue,
    totalPct: sum,
    normalized,
    stablePct: normalized
      .filter((item) => ["USDC", "USDT", "DAI", "CASH"].includes(item.symbol))
      .reduce((accumulator, item) => accumulator + item.pct, 0),
  };
}

function calculateDca(trade) {
  const recurring = Math.max(toNumber(refs.dcaRecurringInput.value, 0), 0);
  const startPrice = Math.max(toNumber(refs.dcaPriceInput.value, trade.buyPrice || 1), 0.0001);
  const periods = Math.max(Math.round(toNumber(refs.dcaPeriodsInput.value, 26)), 1);
  const growth = toNumber(refs.dcaGrowthInput.value, 18) / 100;
  const frequency = refs.dcaFrequencyInput.value || "weekly";
  const periodsPerYear = frequency === "weekly" ? 52 : frequency === "biweekly" ? 26 : 12;
  const growthPerPeriod = Math.pow(1 + growth, 1 / periodsPerYear) - 1;

  const data = [];
  let invested = 0;
  let units = 0;
  let currentPrice = startPrice;

  for (let index = 1; index <= periods; index += 1) {
    invested += recurring;
    units += recurring / currentPrice;
    const projectedValue = units * currentPrice;
    data.push({
      label: `P${index}`,
      invested,
      projectedValue,
      price: currentPrice,
      units,
    });
    currentPrice *= 1 + growthPerPeriod;
  }

  const last = data[data.length - 1];
  return {
    recurring,
    startPrice,
    periods,
    growth,
    frequency,
    data,
    invested: last?.invested ?? 0,
    units: last?.units ?? 0,
    projectedValue: last?.projectedValue ?? 0,
    avgCost: last?.units ? last.invested / last.units : 0,
  };
}

function calculateStaking() {
  const principal = Math.max(toNumber(refs.stakingPrincipalInput.value, 0), 0);
  const months = Math.max(toNumber(refs.stakingMonthsInput.value, 12), 0);
  const apy = clamp(toNumber(refs.stakingApyInput.value, 8.6), 0, 500) / 100;
  const compounding = refs.stakingCompoundingInput.value || "daily";
  const periodsPerYear = compounding === "daily" ? 365 : compounding === "weekly" ? 52 : 12;
  const years = months / 12;
  const futureValue = principal * Math.pow(1 + apy / periodsPerYear, periodsPerYear * years);
  const earned = futureValue - principal;
  const monthlyYield = months > 0 ? earned / months : 0;

  return {
    principal,
    months,
    apy,
    compounding,
    futureValue,
    earned,
    monthlyYield,
  };
}

function renderLineChart(container, config) {
  const width = 720;
  const height = 270;
  const padding = { top: 24, right: 20, bottom: 42, left: 40 };
  const seriesValues = config.series.flatMap((series) => series.values);
  let min = Math.min(...seriesValues, 0);
  let max = Math.max(...seriesValues, 0);

  if (min === max) {
    min -= 1;
    max += 1;
  }

  const range = max - min;
  const xSpan = width - padding.left - padding.right;
  const ySpan = height - padding.top - padding.bottom;
  const labelCount = Math.max(config.labels.length - 1, 1);

  const xPosition = (index) => padding.left + (index / labelCount) * xSpan;
  const yPosition = (value) => padding.top + ((max - value) / range) * ySpan;
  const zeroY = yPosition(0);

  const gridLines = Array.from({ length: 4 }, (_, index) => {
    const ratio = index / 3;
    const value = max - ratio * range;
    const y = padding.top + ratio * ySpan;
    return `
      <g>
        <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3 6" />
        <text x="6" y="${y + 4}" fill="rgba(255,255,255,0.45)" font-size="11">${escapeHtml(config.formatter(value))}</text>
      </g>
    `;
  }).join("");

  const zeroLine =
    min < 0 && max > 0
      ? `<line x1="${padding.left}" y1="${zeroY}" x2="${width - padding.right}" y2="${zeroY}" stroke="rgba(244,180,95,0.35)" />`
      : "";

  const seriesMarkup = config.series
    .map((series, seriesIndex) => {
      const points = series.values
        .map((value, index) => `${xPosition(index)},${yPosition(value)}`)
        .join(" ");
      const firstX = xPosition(0);
      const lastX = xPosition(series.values.length - 1);
      const area = `
        <polygon
          points="${firstX},${zeroY} ${points} ${lastX},${zeroY}"
          fill="${series.fill || "transparent"}"
          opacity="1"
        />
      `;
      const circles = series.values
        .map(
          (value, index) => `
            <circle
              cx="${xPosition(index)}"
              cy="${yPosition(value)}"
              r="${seriesIndex === 0 ? 4 : 3}"
              fill="${series.color}"
              stroke="#071015"
              stroke-width="2"
            />
          `,
        )
        .join("");

      return `
        ${series.fill ? area : ""}
        <polyline
          points="${points}"
          fill="none"
          stroke="${series.color}"
          stroke-width="${seriesIndex === 0 ? 3 : 2.5}"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        ${circles}
      `;
    })
    .join("");

  const labels = config.labels
    .map(
      (label, index) => `
        <text
          x="${xPosition(index)}"
          y="${height - 12}"
          text-anchor="middle"
          fill="rgba(255,255,255,0.62)"
          font-size="11"
        >
          ${escapeHtml(label)}
        </text>
      `,
    )
    .join("");

  container.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Projection chart">
      ${gridLines}
      ${zeroLine}
      ${seriesMarkup}
      ${labels}
    </svg>
  `;
}

function renderProjectionChart(trade) {
  const labels = ["Entry", "Break-even", "Current", "Target"];
  const values = [-trade.entryFees, 0, trade.profitLoss, trade.returnAfterFees];

  renderLineChart(refs.projectionChart, {
    labels,
    series: [
      {
        color: "#4bd7c7",
        fill: "rgba(75, 215, 199, 0.18)",
        values,
      },
    ],
    formatter: (value) => formatCompact(value),
  });
}

function renderScenarioChart(trade) {
  const scenarios = [
    {
      label: "Bear",
      price: Math.max(trade.breakEvenPrice * 0.96, trade.currentPrice * 0.9),
    },
    {
      label: "Base",
      price: trade.sellPrice,
    },
    {
      label: "Bull",
      price: Math.max(trade.sellPrice * 1.14, trade.currentPrice * 1.18),
    },
  ].map((scenario) => {
    const netValue =
      trade.quantity * scenario.price * (1 - trade.feeRate - trade.slippageRate) -
      trade.investedCapital;
    return {
      ...scenario,
      netValue,
    };
  });

  const maxAbs = Math.max(...scenarios.map((scenario) => Math.abs(scenario.netValue)), 1);

  refs.scenarioChart.innerHTML = scenarios
    .map((scenario) => {
      const heightPct = clamp((Math.abs(scenario.netValue) / maxAbs) * 100, 8, 100);
      const tone = scenario.netValue >= 0 ? "positive" : "negative";
      return `
        <article class="bar-item">
          <div class="bar-column">
            <div class="bar-fill ${scenario.netValue < 0 ? "negative" : ""}" style="height: ${heightPct}%"></div>
          </div>
          <div>
            <strong>${escapeHtml(scenario.label)}</strong>
            <p class="${tone}">${escapeHtml(formatCurrency(scenario.netValue, trade.fiat))}</p>
            <small>${escapeHtml(formatCurrency(scenario.price, trade.fiat))}</small>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderTradeSection(trade) {
  renderMetricCards(refs.tradeMetrics, [
    {
      label: "Current Value",
      value: formatCurrency(trade.currentValue, trade.fiat),
      note: `${formatNumber(trade.quantity, 4)} ${trade.asset} at spot`,
    },
    {
      label: "Profit / Loss",
      value: formatCurrency(trade.profitLoss, trade.fiat),
      note: "Includes entry fees and exit drag at current spot",
      tone: trade.profitLoss >= 0 ? "positive" : "negative",
    },
    {
      label: "Gain / Loss %",
      value: signedPercent(trade.profitLossPct),
      note: "Net performance against deployed capital",
      tone: trade.profitLossPct >= 0 ? "positive" : "negative",
    },
    {
      label: "Break-even",
      value: formatCurrency(trade.breakEvenPrice, trade.fiat),
      note: "Target minimum after fees and slippage",
    },
    {
      label: "Estimated Fees",
      value: formatCurrency(trade.totalFees, trade.fiat),
      note: "Entry fee, exit fee, and slippage at target",
    },
    {
      label: "Net Proceeds",
      value: formatCurrency(trade.netProceeds, trade.fiat),
      note: "Gross sale less estimated execution drag",
    },
    {
      label: "Return After Fees",
      value: formatCurrency(trade.returnAfterFees, trade.fiat),
      note: "Projected outcome if the sell target fills",
      tone: trade.returnAfterFees >= 0 ? "positive" : "negative",
    },
    {
      label: "Position Summary",
      value: formatCurrency(trade.exposure, trade.fiat),
      note: `Margin used ${formatCurrency(trade.marginUsed, trade.fiat)} at ${trade.leverage.toFixed(0)}x`,
    },
  ]);
}

function renderHeroSection(trade, risk, dca, staking) {
  renderMetricCards(refs.heroMetrics, [
    {
      label: `${trade.asset} Spot`,
      value: formatCurrency(trade.liveSpot, trade.fiat),
      note: `${signedPercent(getMarketChange(trade.asset))} over 24h`,
      tone: getMarketChange(trade.asset) >= 0 ? "positive" : "negative",
    },
    {
      label: "Target Net",
      value: formatCurrency(trade.returnAfterFees, trade.fiat),
      note: `At ${formatCurrency(trade.sellPrice, trade.fiat)} sell target`,
      tone: trade.returnAfterFees >= 0 ? "positive" : "negative",
    },
    {
      label: "Risk / Reward",
      value: `${risk.rr.toFixed(2)}R`,
      note: `${formatCurrency(risk.allowedRisk, trade.fiat)} risk budget on ${formatCurrency(risk.accountSize, trade.fiat)} account`,
      tone: risk.rr >= 2 ? "positive" : "",
    },
    {
      label: "Yield + DCA",
      value: formatCurrency(dca.projectedValue + staking.futureValue, trade.fiat),
      note: "Combined projected value from DCA and staking tools",
    },
  ]);
}

function renderRiskSection(risk, trade) {
  renderMiniMetrics(refs.riskMetrics, [
    {
      label: "Allowed Risk",
      value: formatCurrency(risk.allowedRisk, trade.fiat),
      note: `${formatPercent(risk.riskPercent)} of account size`,
    },
    {
      label: "Suggested Size",
      value: `${formatNumber(risk.units, 4)} ${trade.asset}`,
      note: `Approx. ${formatCurrency(risk.notional, trade.fiat)} notional`,
    },
    {
      label: "Reward at Target",
      value: formatCurrency(risk.rewardValue, trade.fiat),
      note: `${formatCurrency(risk.take, trade.fiat)} take-profit level`,
      tone: risk.rewardValue >= 0 ? "positive" : "",
    },
    {
      label: "Stop Distance",
      value: formatPercent(risk.stopDistancePct),
      note: `${formatCurrency(risk.stop, trade.fiat)} stop from ${formatCurrency(risk.entry, trade.fiat)} entry`,
    },
  ]);
}

function renderTakeProfitSection(rows, trade) {
  refs.tpRows.innerHTML = rows
    .map(
      (row) => `
        <article class="history-item">
          <div class="list-row">
            <strong>${escapeHtml(row.label)}</strong>
            <span>${escapeHtml(formatCurrency(row.price, trade.fiat))}</span>
          </div>
          <div class="list-row">
            <small>Scale-out</small>
            <small>${escapeHtml(formatPercent(row.allocation * 100, 0))} of position</small>
          </div>
          <div class="list-row">
            <small>${escapeHtml(formatNumber(row.qty, 4))} ${escapeHtml(trade.asset)}</small>
            <small class="${row.pnl >= 0 ? "positive" : "negative"}">${escapeHtml(formatCurrency(row.pnl, trade.fiat))}</small>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderLiquidationSection(liquidation, trade) {
  document.querySelectorAll("[data-liquidation-type]").forEach((button) => {
    button.classList.toggle("active", button.dataset.liquidationType === state.liquidationSide);
  });

  const tone = liquidation.bufferPct < 10 ? "negative" : liquidation.bufferPct < 20 ? "" : "positive";
  refs.liquidationOutput.innerHTML = `
    <h3>${escapeHtml(formatCurrency(liquidation.price, trade.fiat))}</h3>
    <p>
      Approximate ${escapeHtml(liquidation.side)} liquidation level using ${trade.leverage.toFixed(0)}x leverage
      and ${formatPercent(liquidation.mmr * 100, 1)} maintenance margin.
    </p>
    <p class="${tone}">
      Buffer from current spot: ${escapeHtml(formatPercent(liquidation.bufferPct))}.
      Keep this comfortably wide and do not treat it as exchange-specific liquidation advice.
    </p>
  `;
}

function renderTaxSection(tax, trade) {
  renderMiniMetrics(refs.taxMetrics, [
    {
      label: "Taxable Gain",
      value: formatCurrency(tax.taxableGain, trade.fiat),
      note: tax.discount > 0 ? "Long-hold discount applied" : "No long-hold discount applied",
    },
    {
      label: "Estimated Tax Due",
      value: formatCurrency(tax.taxDue, trade.fiat),
      note: `${formatPercent(tax.rate * 100, 0)} estimated rate`,
    },
    {
      label: "After-tax Gain",
      value: formatCurrency(tax.afterTax, trade.fiat),
      note: "Rough planning number only",
      tone: tax.afterTax >= 0 ? "positive" : "negative",
    },
    {
      label: "Hold Duration",
      value: `${formatNumber(tax.months, 0)} months`,
      note: "Holding period can materially change tax outcomes",
    },
  ]);
}

function renderMarketLists(trade) {
  const favorites = ["BTC", "ETH", "SOL", "BNB", "AVAX", "USDC"];
  refs.watchlistSource.textContent =
    state.marketStatus === "live"
      ? "Live"
      : state.marketStatus === "loading"
        ? "Loading"
        : "Fallback";

  refs.watchlistList.innerHTML = favorites
    .slice(0, 4)
    .map((symbol) => {
      const asset = ASSET_MAP[symbol];
      const change = getMarketChange(symbol);
      const price = getSpotPrice(symbol, trade.fiat);
      return `
        <button type="button" class="watch-item" data-watch-symbol="${symbol}">
          <div class="watch-row">
            <div class="watch-row">
              <span class="dot" style="background:${asset.color}"></span>
              <strong>${escapeHtml(symbol)}</strong>
            </div>
            <strong>${escapeHtml(formatCurrency(price, trade.fiat))}</strong>
          </div>
          <small class="${change >= 0 ? "positive" : "negative"}">${escapeHtml(signedPercent(change))} | ${escapeHtml(asset.name)}</small>
        </button>
      `;
    })
    .join("");

  refs.marketRibbon.innerHTML = favorites
    .map((symbol) => {
      const asset = ASSET_MAP[symbol];
      const change = getMarketChange(symbol);
      const price = getSpotPrice(symbol, trade.fiat);
      return `
        <button type="button" class="watch-item" data-watch-symbol="${symbol}">
          <div class="watch-row">
            <div>
              <strong>${escapeHtml(symbol)}</strong>
              <p>${escapeHtml(asset.name)}</p>
            </div>
            <div>
              <strong>${escapeHtml(formatCurrency(price, trade.fiat))}</strong>
              <p class="${change >= 0 ? "positive" : "negative"}">${escapeHtml(signedPercent(change))}</p>
            </div>
          </div>
        </button>
      `;
    })
    .join("");

  refs.marketUpdated.textContent =
    state.marketStatus === "loading" ? "Refreshing..." : state.marketUpdatedAt || "Waiting";
  refs.marketMessage.textContent = state.marketMessage;
  refs.marketBadge.textContent =
    state.marketStatus === "live"
      ? "Market live"
      : state.marketStatus === "loading"
        ? "Market loading"
        : "Market fallback";
}

function renderAllocationSection(allocation, trade) {
  let message = `Configured weight: ${formatPercent(allocation.totalPct, 1)}.`;
  if (allocation.totalPct < 100) {
    message += ` Remaining ${formatPercent(100 - allocation.totalPct, 1)} sits in cash for the chart.`;
  } else if (allocation.totalPct > 100) {
    message += " Entries above 100% are normalized for the visualization.";
  } else {
    message += ` Stablecoin buffer: ${formatPercent(allocation.stablePct, 1)}.`;
  }
  refs.allocationTotal.textContent = message;

  let start = 0;
  const gradientParts = allocation.normalized.map((slice) => {
    const end = start + slice.pct;
    const segment = `${slice.color} ${start}% ${end}%`;
    start = end;
    return segment;
  });

  refs.allocationDonut.style.background = `conic-gradient(${gradientParts.join(", ")})`;
  refs.allocationLegend.innerHTML = allocation.normalized
    .map(
      (slice) => `
        <article class="legend-item">
          <div class="watch-row">
            <span class="dot" style="background:${slice.color}"></span>
            <div>
              <strong>${escapeHtml(slice.symbol)}</strong>
              <p>${escapeHtml(slice.name)}</p>
            </div>
          </div>
          <strong>${escapeHtml(formatPercent(slice.pct, 1))}</strong>
        </article>
      `,
    )
    .join("");

  refs.allocationAmounts.innerHTML = allocation.normalized
    .map(
      (slice) => `
        <article class="history-item">
          <div class="amount-row">
            <div class="watch-row">
              <span class="dot" style="background:${slice.color}"></span>
              <strong>${escapeHtml(slice.symbol)}</strong>
            </div>
            <strong>${escapeHtml(formatCurrency(slice.amount, trade.fiat))}</strong>
          </div>
          <small>${escapeHtml(formatPercent(slice.pct, 1))} of ${escapeHtml(formatCurrency(allocation.totalValue, trade.fiat))}</small>
        </article>
      `,
    )
    .join("");
}

function renderDcaSection(dca, trade) {
  const labels = dca.data.map((point) => point.label);
  renderLineChart(refs.dcaChart, {
    labels,
    series: [
      {
        color: "#f4b45f",
        values: dca.data.map((point) => point.invested),
      },
      {
        color: "#4bd7c7",
        fill: "rgba(75, 215, 199, 0.1)",
        values: dca.data.map((point) => point.projectedValue),
      },
    ],
    formatter: (value) => formatCompact(value),
  });

  renderMiniMetrics(refs.dcaMetrics, [
    {
      label: "Capital Deployed",
      value: formatCurrency(dca.invested, trade.fiat),
      note: `${formatNumber(dca.periods, 0)} ${escapeHtml(dca.frequency)} contributions`,
    },
    {
      label: "Units Accumulated",
      value: `${formatNumber(dca.units, 4)} ${trade.asset}`,
      note: `Average cost ${formatCurrency(dca.avgCost, trade.fiat)}`,
    },
    {
      label: "Projected Value",
      value: formatCurrency(dca.projectedValue, trade.fiat),
      note: `At ${formatPercent(dca.growth * 100, 0)} annualized growth`,
      tone: dca.projectedValue >= dca.invested ? "positive" : "negative",
    },
    {
      label: "Projected Spread",
      value: formatCurrency(dca.projectedValue - dca.invested, trade.fiat),
      note: "Projected value less contributed capital",
      tone: dca.projectedValue >= dca.invested ? "positive" : "negative",
    },
  ]);
}

function renderStakingSection(staking, trade) {
  renderMiniMetrics(refs.stakingMetrics, [
    {
      label: "Future Value",
      value: formatCurrency(staking.futureValue, trade.fiat),
      note: `${formatPercent(staking.apy * 100, 2)} APY with ${escapeHtml(staking.compounding)} compounding`,
    },
    {
      label: "Yield Earned",
      value: formatCurrency(staking.earned, trade.fiat),
      note: `${formatNumber(staking.months, 0)} month position`,
      tone: staking.earned >= 0 ? "positive" : "",
    },
    {
      label: "Monthly Yield",
      value: formatCurrency(staking.monthlyYield, trade.fiat),
      note: "Average earned per month over the plan",
    },
    {
      label: "Principal",
      value: formatCurrency(staking.principal, trade.fiat),
      note: "Starting capital committed to staking",
    },
  ]);
}

function renderHistorySection() {
  refs.historyList.innerHTML = state.history.length
    ? state.history
        .map(
          (item) => `
            <button type="button" class="history-item" data-history-id="${item.id}">
              <div class="list-row">
                <strong>${escapeHtml(item.label)}</strong>
                <small>${escapeHtml(item.createdAt)}</small>
              </div>
              <div class="list-row">
                <small>${escapeHtml(item.asset)} | ${escapeHtml(formatNumber(item.quantity, 4))} units</small>
                <small>${escapeHtml(formatCurrency(item.targetReturn, item.fiat))}</small>
              </div>
            </button>
          `,
        )
        .join("")
    : `<article class="history-item"><small>No saved trades yet.</small></article>`;
}

function renderSnapshotsSection() {
  refs.snapshotList.innerHTML = state.snapshots.length
    ? state.snapshots
        .map(
          (snapshot) => `
            <button type="button" class="history-item" data-snapshot-id="${snapshot.id}">
              <div class="list-row">
                <strong>Snapshot</strong>
                <small>${escapeHtml(snapshot.createdAt)}</small>
              </div>
              <small>${escapeHtml(formatCurrency(snapshot.total, getSelectedFiat()))} across ${snapshot.allocations.length} slices</small>
            </button>
          `,
        )
        .join("")
    : `<article class="history-item"><small>No snapshots saved yet.</small></article>`;
}

function renderJournalSection() {
  refs.journalList.innerHTML = state.journal.length
    ? state.journal
        .map(
          (entry) => `
            <article class="journal-item">
              <div class="list-row">
                <strong>${escapeHtml(entry.headline)}</strong>
                <small>${escapeHtml(entry.createdAt)}</small>
              </div>
              <small>${escapeHtml(entry.body)}</small>
            </article>
          `,
        )
        .join("")
    : `<article class="journal-item"><small>No journal notes yet.</small></article>`;
}

function renderUiState() {
  document.body.classList.toggle("focus-mode", state.focusMode);
  persistUiState();

  document.querySelectorAll('[data-action="toggle-demo"]').forEach((button) => {
    button.textContent = state.demoMode ? "Demo Mode: On" : "Demo Mode: Off";
  });

  document.querySelectorAll('[data-action="toggle-focus"]').forEach((button) => {
    button.textContent = state.focusMode ? "Focus Mode: On" : "Focus Mode";
    button.classList.toggle("muted", !state.focusMode);
  });

  refs.demoBadge.textContent = state.demoMode ? "Demo-ready" : "Live-ready";
  refs.assistantBadge.textContent =
    state.provider.apiKey && !state.demoMode ? "AI configured" : "AI demo";
  refs.assistantProviderBadge.textContent =
    state.provider.apiKey && !state.demoMode
      ? `${state.provider.name} | ${state.provider.model}`
      : "Demo strategist";
}

function updateAssistantBadges(mode = null, meta = null) {
  const computedMode =
    mode ??
    (state.provider.apiKey && !state.demoMode ? "live key" : state.demoMode ? "demo" : "local");
  refs.assistantModeBadge.textContent = computedMode;
  refs.assistantMeta.textContent =
    meta ??
    (state.provider.apiKey && !state.demoMode
      ? `${state.provider.name} | ${state.provider.model}`
      : "Demo strategist");
}

function setAssistantOutput(text, mode = null, meta = null) {
  refs.assistantOutput.textContent = text;
  updateAssistantBadges(mode, meta);
}

function buildAssistantContext() {
  const { trade, risk, liquidation, tax, allocation, dca, staking } = state.computed;
  const strongest = [...ASSETS]
    .sort((left, right) => getMarketChange(right.symbol) - getMarketChange(left.symbol))
    .slice(0, 3);
  const weakest = [...ASSETS]
    .sort((left, right) => getMarketChange(left.symbol) - getMarketChange(right.symbol))
    .slice(0, 2);

  return {
    trade,
    risk,
    liquidation,
    tax,
    allocation,
    dca,
    staking,
    strongest,
    weakest,
    prompt: refs.assistantPrompt.value.trim(),
    summaryText: `
Asset: ${trade.asset}
Fiat: ${trade.fiat}
Quantity: ${formatNumber(trade.quantity, 4)}
Buy price: ${formatCurrency(trade.buyPrice, trade.fiat)}
Current price: ${formatCurrency(trade.currentPrice, trade.fiat)}
Sell target: ${formatCurrency(trade.sellPrice, trade.fiat)}
Current P/L: ${formatCurrency(trade.profitLoss, trade.fiat)} (${signedPercent(trade.profitLossPct)})
Break-even: ${formatCurrency(trade.breakEvenPrice, trade.fiat)}
Risk/Reward: ${risk.rr.toFixed(2)}R
Liquidation buffer: ${formatPercent(liquidation.bufferPct)}
Portfolio stable exposure: ${formatPercent(allocation.stablePct, 1)}
DCA projected value: ${formatCurrency(dca.projectedValue, trade.fiat)}
Staking future value: ${formatCurrency(staking.futureValue, trade.fiat)}
Market breadth leaders: ${strongest.map((asset) => `${asset.symbol} ${signedPercent(getMarketChange(asset.symbol))}`).join(", ")}
Weakest movers: ${weakest.map((asset) => `${asset.symbol} ${signedPercent(getMarketChange(asset.symbol))}`).join(", ")}
Tax estimate: ${formatCurrency(tax.taxDue, trade.fiat)}
    `.trim(),
  };
}

function generateDemoAssistant(task, context) {
  const { trade, risk, liquidation, tax, allocation, dca, staking, strongest, weakest } = context;

  if (task === "compare") {
    const baseReturn = trade.returnAfterFees;
    const bullReturn =
      trade.quantity * (trade.sellPrice * 1.14) * (1 - trade.feeRate - trade.slippageRate) -
      trade.investedCapital;
    const bearReturn =
      trade.quantity * (trade.currentPrice * 0.9) * (1 - trade.feeRate - trade.slippageRate) -
      trade.investedCapital;
    return [
      `Scenario comparison for ${trade.asset}:`,
      "",
      `Bear case: ${formatCurrency(bearReturn, trade.fiat)} if price loses another 10% from current spot.`,
      `Base case: ${formatCurrency(baseReturn, trade.fiat)} if the current target at ${formatCurrency(trade.sellPrice, trade.fiat)} fills.`,
      `Bull case: ${formatCurrency(bullReturn, trade.fiat)} if momentum extends roughly 14% beyond the target.`,
      "",
      `The current structure stays attractive when fees remain controlled and the trade still carries ${risk.rr.toFixed(2)}R upside against the stop plan.`,
    ].join("\n");
  }

  if (task === "portfolio") {
    const topHoldings = allocation.normalized
      .filter((slice) => slice.symbol !== "CASH")
      .slice(0, 3)
      .map((slice) => `${slice.symbol} ${formatPercent(slice.pct, 1)}`)
      .join(", ");
    return [
      "Portfolio posture summary:",
      "",
      `Top concentration sits in ${topHoldings}.`,
      `Stable allocation is ${formatPercent(allocation.stablePct, 1)}, which is ${allocation.stablePct >= 15 ? "healthy for optionality" : "lean for a volatile tape"}.`,
      `The DCA model projects ${formatCurrency(dca.projectedValue, trade.fiat)} and the staking sleeve compounds toward ${formatCurrency(staking.futureValue, trade.fiat)}.`,
      "",
      "A practical tweak would be keeping high-beta exposure focused in one or two conviction names instead of letting every alt position expand at once.",
    ].join("\n");
  }

  if (task === "sentiment") {
    const breadth = ASSETS.filter((asset) => getMarketChange(asset.symbol) >= 0).length;
    return [
      "Sentiment summary using the current dashboard data only:",
      "",
      `Breadth is ${breadth}/${ASSETS.length} green on the watchlist.`,
      `Leadership is coming from ${strongest.map((asset) => `${asset.symbol} ${signedPercent(getMarketChange(asset.symbol))}`).join(", ")}.`,
      `Relative weakness is concentrated in ${weakest.map((asset) => `${asset.symbol} ${signedPercent(getMarketChange(asset.symbol))}`).join(", ")}.`,
      "",
      `${trade.asset} looks ${getMarketChange(trade.asset) >= 0 ? "supported by positive momentum" : "more fragile than the leaders"}, but position sizing still matters more than short-term tape color.`,
    ].join("\n");
  }

  if (task === "risk") {
    const leverageWarning =
      liquidation.bufferPct < 10
        ? "The liquidation buffer is uncomfortably tight."
        : liquidation.bufferPct < 18
          ? "The liquidation buffer deserves close monitoring."
          : "The liquidation buffer is reasonably healthy for now.";
    return [
      `Risk notes for the ${trade.asset} setup:`,
      "",
      `The plan risks about ${formatCurrency(risk.allowedRisk, trade.fiat)} for a ${risk.rr.toFixed(2)}R reward profile.`,
      `Break-even sits at ${formatCurrency(trade.breakEvenPrice, trade.fiat)} and total execution drag is roughly ${formatCurrency(trade.totalFees, trade.fiat)}.`,
      `${leverageWarning} Approximate liquidation is ${formatCurrency(liquidation.price, trade.fiat)} with a ${formatPercent(liquidation.bufferPct)} gap from current spot.`,
      "",
      "If this were my worksheet, I would only increase size after either widening the stop with lower leverage or seeing the target remain attractive after fees.",
    ].join("\n");
  }

  return [
    `${trade.asset} trade explanation:`,
    "",
    `You are long ${formatNumber(trade.quantity, 4)} ${trade.asset} from ${formatCurrency(trade.buyPrice, trade.fiat)} with current spot at ${formatCurrency(trade.currentPrice, trade.fiat)}.`,
    `After entry fees and exit drag, the position is sitting at ${formatCurrency(trade.profitLoss, trade.fiat)} (${signedPercent(trade.profitLossPct)}).`,
    `Your break-even sits near ${formatCurrency(trade.breakEvenPrice, trade.fiat)}, and the planned exit at ${formatCurrency(trade.sellPrice, trade.fiat)} points to ${formatCurrency(trade.returnAfterFees, trade.fiat)} net.`,
    "",
    `The trade is acceptable when you are comfortable risking ${formatCurrency(risk.allowedRisk, trade.fiat)} and respecting the stop near ${formatCurrency(risk.stop, trade.fiat)}. Estimated tax from the helper is ${formatCurrency(tax.taxDue, trade.fiat)}. This is informational, not financial advice.`,
  ].join("\n");
}

function buildAssistantPrompts(task, context) {
  const userTaskMap = {
    explain: "Explain the current calculator results in plain English.",
    compare: "Compare the current trade across bear, base, and bull scenarios.",
    portfolio: "Summarize the current portfolio shape and suggest one balancing idea.",
    sentiment: "Summarize market sentiment using only the provided dashboard inputs.",
    risk: "Write risk notes and a reflection for the current trade.",
  };

  const systemPrompt =
    "You are the AI assistant for a crypto calculator web app. Use only the data supplied in the user prompt. Do not invent live prices, news, or facts not included in the prompt. Be concise, practical, and explicitly state that the result is informational only, not legal or financial advice.";

  const userPrompt = `
Task: ${userTaskMap[task] || userTaskMap.explain}

Calculator context:
${context.summaryText}

User note:
${context.prompt || "No extra note supplied."}
  `.trim();

  return { systemPrompt, userPrompt };
}

async function callConfiguredProvider(task, context) {
  const config = getActiveProviderConfig();
  if (!config.apiKey) {
    throw new Error("No API key configured in settings.");
  }

  const { systemPrompt, userPrompt } = buildAssistantPrompts(task, context);
  const type = config.type;

  if (type === "anthropic") {
    const endpoint = config.baseUrl || PROVIDER_DEFAULTS.anthropic.baseUrl;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: 700,
        temperature: config.temperature,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic request failed (${response.status}).`);
    }

    const data = await response.json();
    const text = (data.content || [])
      .map((item) => item.text)
      .filter(Boolean)
      .join("\n");

    if (!text) {
      throw new Error("Anthropic returned no text.");
    }

    return text;
  }

  if (type === "gemini") {
    const baseUrl = (config.baseUrl || PROVIDER_DEFAULTS.gemini.baseUrl).replace(/\/$/, "");
    const endpoint = `${baseUrl}/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        generationConfig: {
          temperature: config.temperature,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini request failed (${response.status}).`);
    }

    const data = await response.json();
    const text = (data.candidates?.[0]?.content?.parts || [])
      .map((item) => item.text)
      .filter(Boolean)
      .join("\n");

    if (!text) {
      throw new Error("Gemini returned no text.");
    }

    return text;
  }

  const baseUrl = (config.baseUrl || PROVIDER_DEFAULTS[type]?.baseUrl || "").replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("No base URL configured for the selected provider.");
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      temperature: config.temperature,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Provider request failed (${response.status}).`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  const text = Array.isArray(content)
    ? content.map((item) => item.text || item.content || "").join("\n")
    : content;

  if (!text) {
    throw new Error("Provider returned no message content.");
  }

  return text;
}

async function runAssistant(task) {
  const context = buildAssistantContext();
  setAssistantOutput("Thinking through the current calculator state...", "working", "Aether Assistant");

  if (state.provider.apiKey && !state.demoMode) {
    try {
      const response = await callConfiguredProvider(task, context);
      setAssistantOutput(response, "live key", `${state.provider.name} | ${state.provider.model}`);
      return;
    } catch (error) {
      const fallback = generateDemoAssistant(task, context);
      setAssistantOutput(
        `${fallback}\n\nFallback note: ${error.message}`,
        "fallback",
        "Demo strategist fallback",
      );
      showToast("Live AI call failed, so the assistant fell back to demo mode.", "warn");
      return;
    }
  }

  setAssistantOutput(generateDemoAssistant(task, context), state.demoMode ? "demo" : "local", "Demo strategist");
}

function renderAll() {
  syncRangeLabels();
  persistProviderState();

  const trade = calculateTrade();
  const risk = calculateRisk(trade);
  const tp = calculateTakeProfit(trade);
  const liquidation = calculateLiquidation(trade);
  const tax = calculateTax(trade);
  const allocation = calculateAllocation();
  const dca = calculateDca(trade);
  const staking = calculateStaking();

  state.computed = { trade, risk, tp, liquidation, tax, allocation, dca, staking };

  renderTradeSection(trade);
  renderHeroSection(trade, risk, dca, staking);
  renderProjectionChart(trade);
  renderScenarioChart(trade);
  renderRiskSection(risk, trade);
  renderTakeProfitSection(tp, trade);
  renderLiquidationSection(liquidation, trade);
  renderTaxSection(tax, trade);
  renderMarketLists(trade);
  renderAllocationSection(allocation, trade);
  renderDcaSection(dca, trade);
  renderStakingSection(staking, trade);
  renderHistorySection();
  renderSnapshotsSection();
  renderJournalSection();
  renderUiState();
  persistFormState();
  updateAssistantBadges();
  refs.assistantPreview.textContent = generateDemoAssistant("explain", buildAssistantContext()).split("\n\n")[0];
}

function parseNaturalLanguagePrompt(prompt) {
  const cleaned = prompt.trim();
  const lower = cleaned.toLowerCase();
  const result = {};

  const asset = ASSETS.find(
    (item) =>
      lower.includes(item.symbol.toLowerCase()) || lower.includes(item.name.toLowerCase()),
  );
  if (asset) {
    result.assetSelect = asset.symbol;
  }

  const fiat = FIATS.find((item) => lower.includes(item.code.toLowerCase()));
  if (fiat) {
    result.fiatSelect = fiat.code;
  }

  const capture = (regex) => {
    const match = cleaned.match(regex);
    return match ? match[1].replace(/,/g, "") : null;
  };

  const quantityMatch = cleaned.match(
    /(\d+(?:\.\d+)?)\s*(BTC|ETH|SOL|BNB|XRP|ADA|DOGE|AVAX|MATIC|LTC|USDC|USDT|DAI)\b/i,
  );
  if (quantityMatch) {
    result.quantityInput = quantityMatch[1];
    result.assetSelect = quantityMatch[2].toUpperCase();
  }

  const amountValue =
    capture(/(?:use|using|deploy|invest|buying with|budget(?: is| of)?|worth)\s*\$?\s*([\d,]+(?:\.\d+)?)/i) ||
    capture(/\$([\d,]+(?:\.\d+)?)\s*(?:usd|aud|eur|gbp|jpy|sgd)?/i);
  if (amountValue) {
    result.amountInput = amountValue;
  }

  const buyPrice = capture(/(?:buy|bought|entry|entered)(?: price)?(?: at)?\s*\$?\s*([\d,]+(?:\.\d+)?)/i);
  const currentPrice = capture(/(?:current|spot|now)(?: price)?(?: is| at)?\s*\$?\s*([\d,]+(?:\.\d+)?)/i);
  const sellPrice = capture(/(?:sell|target|take profit|tp)(?: price)?(?: at)?\s*\$?\s*([\d,]+(?:\.\d+)?)/i);
  const stopPrice = capture(/(?:stop|stop loss)(?: at)?\s*\$?\s*([\d,]+(?:\.\d+)?)/i);
  const leverage = capture(/(\d+(?:\.\d+)?)\s*x/i);
  const fees = capture(/fees?\s*(?:of|at)?\s*([\d.]+)\s*%/i);
  const slippage = capture(/slippage\s*(?:of|at)?\s*([\d.]+)\s*%/i);

  if (buyPrice) {
    result.buyPriceInput = buyPrice;
    result.tpEntryInput = buyPrice;
  }
  if (currentPrice) {
    result.currentPriceInput = currentPrice;
    result.riskEntryInput = currentPrice;
  }
  if (sellPrice) {
    result.sellPriceInput = sellPrice;
    result.riskTakeInput = sellPrice;
    result.tp2Input = sellPrice;
  }
  if (stopPrice) {
    result.riskStopInput = stopPrice;
  }
  if (leverage) {
    result.leverageInput = leverage;
  }
  if (fees) {
    result.feesInput = fees;
  }
  if (slippage) {
    result.slippageInput = slippage;
  }

  return result;
}

function applyAutofillFromPrompt() {
  const prompt = refs.assistantPrompt.value.trim();
  if (!prompt) {
    showToast("Add a natural-language prompt first.", "warn");
    refs.assistantPrompt.focus();
    return;
  }

  const parsed = parseNaturalLanguagePrompt(prompt);
  if (!Object.keys(parsed).length) {
    setAssistantOutput(
      "The auto-fill helper could not confidently extract structured values from that prompt. Try mentioning the asset, entry price, target, fees, slippage, and leverage more explicitly.",
      "demo",
      "Auto-fill helper",
    );
    return;
  }

  Object.entries(parsed).forEach(([id, value]) => {
    if (refs[id]) {
      refs[id].value = value;
    }
  });

  syncRangeLabels();
  renderAll();

  const summary = [
    "Auto-fill extracted these values:",
    "",
    ...Object.entries(parsed).map(([id, value]) => `${id.replace(/Input$|Select$/, "")}: ${value}`),
    "",
    "The calculator has been updated with the parsed values. Review them before relying on the result.",
  ].join("\n");

  setAssistantOutput(summary, "demo", "Auto-fill helper");
  showToast("Calculator inputs updated from the prompt.", "info");
}

function applyPreset(presetId, announce = true) {
  const preset = DEMO_PRESETS.find((entry) => entry.id === presetId);
  if (!preset) {
    return;
  }

  state.activePreset = preset.id;
  Object.entries(preset.values).forEach(([id, value]) => {
    if (refs[id]) {
      refs[id].value = value;
    }
  });

  refs.assistantPrompt.value = preset.prompt;
  renderPresetGrid();
  renderAll();

  if (announce) {
    showToast(`${preset.title} loaded into the dashboard.`, "info");
  }
}

function syncLiveSpotIntoForm() {
  const asset = getSelectedAsset();
  const fiat = getSelectedFiat();
  const spot = getSpotPrice(asset, fiat);

  refs.currentPriceInput.value = spot
    ? String(spot.toFixed(fiat === "JPY" ? 0 : 4))
    : refs.currentPriceInput.value;
  if (!toNumber(refs.sellPriceInput.value, 0)) {
    refs.sellPriceInput.value = String((spot * 1.08).toFixed(fiat === "JPY" ? 0 : 4));
  }
  if (!toNumber(refs.buyPriceInput.value, 0)) {
    refs.buyPriceInput.value = String((spot * 0.95).toFixed(fiat === "JPY" ? 0 : 4));
  }
  refs.riskEntryInput.value = refs.currentPriceInput.value;
  refs.riskTakeInput.value = refs.sellPriceInput.value;

  renderAll();
  showToast(`${asset} spot synced into the calculator.`, "info");
}

function saveCurrentTrade() {
  const trade = state.computed.trade;
  const item = {
    id: uid("history"),
    label: `${trade.asset} setup`,
    createdAt: timestampLabel(),
    asset: trade.asset,
    fiat: trade.fiat,
    quantity: trade.quantity,
    buyPrice: trade.buyPrice,
    currentPrice: trade.currentPrice,
    sellPrice: trade.sellPrice,
    fees: trade.feeRate * 100,
    slippage: trade.slippageRate * 100,
    leverage: trade.leverage,
    amount: trade.amount,
    targetReturn: trade.returnAfterFees,
  };

  state.history = [item, ...state.history].slice(0, 10);
  persistCollections();
  renderHistorySection();
  showToast("Trade setup saved to history.", "info");
}

function restoreHistoryItem(id) {
  const item = state.history.find((entry) => entry.id === id);
  if (!item) {
    return;
  }

  refs.assetSelect.value = item.asset;
  refs.fiatSelect.value = item.fiat;
  refs.quantityInput.value = String(item.quantity);
  refs.amountInput.value = String(item.amount);
  refs.buyPriceInput.value = String(item.buyPrice);
  refs.currentPriceInput.value = String(item.currentPrice);
  refs.sellPriceInput.value = String(item.sellPrice);
  refs.feesInput.value = String(item.fees);
  refs.slippageInput.value = String(item.slippage);
  refs.leverageInput.value = String(item.leverage);
  refs.tpSizeInput.value = String(item.quantity);
  refs.tpEntryInput.value = String(item.buyPrice);
  refs.riskEntryInput.value = String(item.currentPrice);
  refs.riskTakeInput.value = String(item.sellPrice);

  renderAll();
  showToast("Saved setup restored into the calculator.", "info");
}

function saveSnapshot() {
  const allocation = state.computed.allocation;
  state.snapshots = [
    {
      id: uid("snapshot"),
      createdAt: timestampLabel(),
      total: allocation.totalValue,
      allocations: state.allocations.map((item) => ({ ...item })),
    },
    ...state.snapshots,
  ].slice(0, 8);
  persistCollections();
  renderSnapshotsSection();
  showToast("Portfolio snapshot saved locally.", "info");
}

function restoreSnapshot(id) {
  const snapshot = state.snapshots.find((entry) => entry.id === id);
  if (!snapshot) {
    return;
  }

  refs.portfolioValueInput.value = String(snapshot.total);
  state.allocations = snapshot.allocations.map((entry) => ({ ...entry }));
  renderAllocationInputs();
  renderAll();
  showToast("Snapshot restored into the allocation tool.", "info");
}

function saveJournal() {
  const headline = refs.journalHeadlineInput.value.trim();
  const body = refs.journalBodyInput.value.trim();
  if (!headline || !body) {
    showToast("Add both a headline and a reflection before saving.", "warn");
    return;
  }

  state.journal = [
    {
      id: uid("journal"),
      headline,
      body,
      createdAt: timestampLabel(),
    },
    ...state.journal,
  ].slice(0, 10);

  refs.journalHeadlineInput.value = "";
  refs.journalBodyInput.value = "";
  persistCollections();
  renderJournalSection();
  showToast("Journal note saved locally.", "info");
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function exportJson() {
  const payload = {
    exportedAt: new Date().toISOString(),
    ui: {
      demoMode: state.demoMode,
      focusMode: state.focusMode,
      liquidationSide: state.liquidationSide,
    },
    trade: state.computed.trade,
    risk: state.computed.risk,
    allocation: state.computed.allocation,
    dca: state.computed.dca,
    staking: state.computed.staking,
    history: state.history,
    snapshots: state.snapshots,
    journal: state.journal,
    provider: {
      ...state.provider,
      apiKey: state.provider.apiKey ? "[browser-stored key hidden]" : "",
    },
  };

  downloadFile(
    "helix-ledger-export.json",
    JSON.stringify(payload, null, 2),
    "application/json",
  );
  showToast("JSON export downloaded.", "info");
}

function exportCsv() {
  const trade = state.computed.trade;
  const rows = [
    ["field", "value"],
    ["asset", trade.asset],
    ["fiat", trade.fiat],
    ["quantity", trade.quantity],
    ["buy_price", trade.buyPrice],
    ["current_price", trade.currentPrice],
    ["sell_price", trade.sellPrice],
    ["profit_loss", trade.profitLoss],
    ["profit_loss_pct", trade.profitLossPct],
    ["break_even_price", trade.breakEvenPrice],
    ["net_proceeds", trade.netProceeds],
    ["return_after_fees", trade.returnAfterFees],
    ["risk_reward", state.computed.risk.rr],
    ["estimated_tax_due", state.computed.tax.taxDue],
  ];

  const csv = rows
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  downloadFile("helix-ledger-trade.csv", csv, "text/csv;charset=utf-8;");
  showToast("CSV export downloaded.", "info");
}

function toggleDemoMode() {
  state.demoMode = !state.demoMode;
  renderUiState();
  if (state.demoMode) {
    setAssistantOutput(generateDemoAssistant("explain", buildAssistantContext()), "demo", "Demo strategist");
  } else {
    setAssistantOutput(
      state.provider.apiKey
        ? "Live provider mode enabled. Run an assistant task to use the configured API key."
        : "Live-ready mode enabled, but no API key is configured, so the assistant will stay local.",
      state.provider.apiKey ? "live ready" : "local",
      state.provider.apiKey ? `${state.provider.name} | ${state.provider.model}` : "Local assistant",
    );
  }
  showToast(state.demoMode ? "Demo mode enabled." : "Demo mode disabled.", "info");
}

function toggleFocusMode() {
  state.focusMode = !state.focusMode;
  renderUiState();
  showToast(state.focusMode ? "Focus mode enabled." : "Focus mode disabled.", "info");
}

async function refreshMarketData(showToastOnSuccess = true) {
  state.marketStatus = "loading";
  state.marketMessage = "Requesting live market data from CoinGecko...";
  renderAll();

  const ids = ASSETS.map((asset) => asset.id).join(",");
  const endpoint = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Market request failed (${response.status}).`);
    }

    const data = await response.json();
    ASSETS.forEach((asset) => {
      const payload = data[asset.id];
      if (payload?.usd) {
        state.marketPricesUsd[asset.symbol] = payload.usd;
      }
      if (Number.isFinite(payload?.usd_24h_change)) {
        state.marketChanges[asset.symbol] = payload.usd_24h_change;
      }
    });

    state.marketStatus = "live";
    state.marketUpdatedAt = timestampLabel();
    state.marketMessage = "Live CoinGecko prices connected successfully.";
    renderAll();

    if (showToastOnSuccess) {
      showToast("Live market feed refreshed.", "info");
    }
  } catch (error) {
    state.marketStatus = "mock";
    state.marketUpdatedAt = timestampLabel();
    state.marketMessage = `Live feed unavailable, so curated fallback pricing is active. ${error.message}`;
    renderAll();
    showToast("Live market fetch failed, fallback pricing is active.", "warn");
  }
}

function onProviderTypeChange() {
  const nextType = refs.providerTypeInput.value;
  const defaults = PROVIDER_DEFAULTS[nextType] ?? PROVIDER_DEFAULTS.openai;
  const previousDefaults = PROVIDER_DEFAULTS[state.provider.type] ?? PROVIDER_DEFAULTS.openai;

  if (!refs.providerNameInput.value.trim() || refs.providerNameInput.value === previousDefaults.name) {
    refs.providerNameInput.value = defaults.name;
  }

  if (!refs.providerModelInput.value.trim() || refs.providerModelInput.value === previousDefaults.model) {
    refs.providerModelInput.value = defaults.model;
  }

  if (!refs.providerBaseUrlInput.value.trim() || refs.providerBaseUrlInput.value === previousDefaults.baseUrl) {
    refs.providerBaseUrlInput.value = defaults.baseUrl;
  }

  persistProviderState();
  renderUiState();
}

function showToast(message, tone = "info") {
  let stack = document.querySelector("[data-toast-stack]");
  if (!stack) {
    stack = document.createElement("div");
    stack.dataset.toastStack = "true";
    stack.style.cssText = [
      "position:fixed",
      "right:16px",
      "bottom:84px",
      "display:grid",
      "gap:10px",
      "z-index:80",
      "pointer-events:none",
      "max-width:min(92vw,360px)",
    ].join(";");
    document.body.appendChild(stack);
  }

  const toast = document.createElement("div");
  const borderColor =
    tone === "warn" ? "rgba(255, 148, 148, 0.28)" : "rgba(75, 215, 199, 0.28)";
  const accentColor = tone === "warn" ? "#ff9494" : "#4bd7c7";
  toast.textContent = message;
  toast.style.cssText = [
    "padding:12px 14px",
    "border-radius:16px",
    `border:1px solid ${borderColor}`,
    "background:rgba(7,10,14,0.92)",
    "backdrop-filter:blur(16px)",
    "color:#edf5ff",
    "font-size:14px",
    "line-height:1.5",
    `box-shadow:0 24px 70px rgba(0,0,0,0.28), inset 0 0 0 1px ${borderColor}`,
    `outline:1px solid ${accentColor}20`,
    "pointer-events:none",
  ].join(";");
  stack.appendChild(toast);

  window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
  }, 2200);

  window.setTimeout(() => {
    toast.remove();
    if (!stack.childElementCount) {
      stack.remove();
    }
  }, 2800);
}

function handleAction(action) {
  switch (action) {
    case "toggle-demo":
      toggleDemoMode();
      break;
    case "toggle-focus":
      toggleFocusMode();
      break;
    case "save-trade":
      saveCurrentTrade();
      break;
    case "refresh-market":
      refreshMarketData();
      break;
    case "sync-price":
      syncLiveSpotIntoForm();
      break;
    case "autofill":
      applyAutofillFromPrompt();
      break;
    case "save-snapshot":
      saveSnapshot();
      break;
    case "export-json":
      exportJson();
      break;
    case "export-csv":
      exportCsv();
      break;
    case "save-journal":
      saveJournal();
      break;
    default:
      break;
  }
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    if (actionTarget) {
      handleAction(actionTarget.dataset.action);
      return;
    }

    const assistantTarget = event.target.closest("[data-assistant-task]");
    if (assistantTarget) {
      runAssistant(assistantTarget.dataset.assistantTask);
      return;
    }

    const liquidationTarget = event.target.closest("[data-liquidation-type]");
    if (liquidationTarget) {
      state.liquidationSide = liquidationTarget.dataset.liquidationType;
      renderAll();
      return;
    }

    const presetTarget = event.target.closest("[data-preset-id]");
    if (presetTarget) {
      applyPreset(presetTarget.dataset.presetId);
      return;
    }

    const watchTarget = event.target.closest("[data-watch-symbol]");
    if (watchTarget) {
      refs.assetSelect.value = watchTarget.dataset.watchSymbol;
      syncLiveSpotIntoForm();
      return;
    }

    const historyTarget = event.target.closest("[data-history-id]");
    if (historyTarget) {
      restoreHistoryItem(historyTarget.dataset.historyId);
      return;
    }

    const snapshotTarget = event.target.closest("[data-snapshot-id]");
    if (snapshotTarget) {
      restoreSnapshot(snapshotTarget.dataset.snapshotId);
      return;
    }

    const chipTarget = event.target.closest("[data-chip-prompt]");
    if (chipTarget) {
      refs.assistantPrompt.value = chipTarget.dataset.chipPrompt;
      refs.assistantPrompt.focus();
    }
  });

  FORM_FIELD_IDS.forEach((id) => {
    const element = refs[id];
    if (!element) {
      return;
    }
    element.addEventListener("input", () => {
      renderAll();
    });
  });

  refs.allocationInputs.addEventListener("input", () => {
    renderAll();
  });

  refs.providerTypeInput.addEventListener("change", onProviderTypeChange);
  refs.providerNameInput.addEventListener("input", () => {
    persistProviderState();
    renderUiState();
  });
  refs.providerModelInput.addEventListener("input", () => {
    persistProviderState();
    renderUiState();
  });
  refs.providerKeyInput.addEventListener("input", () => {
    persistProviderState();
    renderUiState();
  });
  refs.providerBaseUrlInput.addEventListener("input", () => {
    persistProviderState();
    renderUiState();
  });
  refs.temperatureInput.addEventListener("input", () => {
    syncRangeLabels();
    persistProviderState();
  });

  document.addEventListener("keydown", (event) => {
    const activeTag = document.activeElement?.tagName?.toLowerCase();
    const isTyping = activeTag === "input" || activeTag === "textarea" || activeTag === "select";

    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      refs.assistantPrompt.focus();
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
      event.preventDefault();
      saveCurrentTrade();
      return;
    }

    if (!isTyping && event.key.toLowerCase() === "d") {
      toggleDemoMode();
    }
  });
}

function init() {
  cacheRefs();
  populateSelect(refs.assetSelect, ASSETS, (asset) => asset.symbol, (asset) => `${asset.symbol} | ${asset.name}`);
  populateSelect(refs.fiatSelect, FIATS, (fiat) => fiat.code, (fiat) => fiat.code);

  const savedForm = loadPersistedState();
  renderPresetGrid();
  renderExampleChips();
  renderAllocationInputs();
  applyFormValues(savedForm);
  bindEvents();
  renderAll();
  runAssistant("explain");
  refreshMarketData(false);
}

init();
