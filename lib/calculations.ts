import {
  DcaInput,
  DcaPoint,
  DcaSummary,
  LiquidationInput,
  ParsedPrompt,
  PortfolioAllocationItem,
  PortfolioAllocationResult,
  ProjectionPoint,
  RiskRewardInput,
  RiskRewardSummary,
  ScenarioRow,
  StakingInput,
  StakingSummary,
  TakeProfitPlannerInput,
  TakeProfitRow,
  TaxEstimateInput,
  TaxEstimateResult,
  TradeInput,
  TradeSummary
} from "@/lib/types";
import { clamp, round } from "@/lib/utils";

function sanitize(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function getEffectiveQuantity(input: TradeInput) {
  if (input.quantity > 0) {
    return input.quantity;
  }
  if (input.amount > 0 && input.buyPrice > 0) {
    return input.amount / input.buyPrice;
  }
  return 0;
}

export function calculateTradeSummary(input: TradeInput): TradeSummary {
  const effectiveQuantity = getEffectiveQuantity(input);
  const entryPrice = sanitize(input.buyPrice);
  const currentPrice = sanitize(input.currentPrice);
  const exitPrice = sanitize(input.sellPrice || input.currentPrice);
  const feeRate = clamp(sanitize(input.feesPercent) / 100, 0, 1);
  const slippageRate = clamp(sanitize(input.slippagePercent) / 100, 0, 1);
  const leverage = Math.max(1, sanitize(input.leverage));

  const grossEntryCost = effectiveQuantity * entryPrice;
  const grossCurrentValue = effectiveQuantity * currentPrice;
  const grossExitValue = effectiveQuantity * exitPrice;

  const entryFees = grossEntryCost * feeRate;
  const currentFees = grossCurrentValue * feeRate;
  const exitFees = grossExitValue * feeRate;
  const currentSlippage = grossCurrentValue * (slippageRate / 2);
  const slippageCost = grossExitValue * slippageRate;

  const totalCost = grossEntryCost + entryFees;
  const currentValue = grossCurrentValue - currentFees - currentSlippage;
  const currentPnl = currentValue - totalCost;
  const currentPnlPercent = totalCost > 0 ? (currentPnl / totalCost) * 100 : 0;

  const netProceeds = grossExitValue - exitFees - slippageCost;
  const pnl = netProceeds - totalCost;
  const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
  const marginUsed = leverage > 1 ? totalCost / leverage : totalCost;
  const roiAfterFees = marginUsed > 0 ? (pnl / marginUsed) * 100 : 0;
  const breakEvenPrice =
    effectiveQuantity > 0
      ? totalCost / (effectiveQuantity * Math.max(1 - feeRate - slippageRate, 0.0001))
      : 0;

  const liquidationBuffer = leverage <= 1 ? 0 : (1 / leverage) * 0.92;
  const liquidationPrice =
    leverage <= 1 ? 0 : Math.max(0, entryPrice * (1 - liquidationBuffer));

  return {
    effectiveQuantity: round(effectiveQuantity, 6),
    grossEntryCost: round(grossEntryCost),
    grossCurrentValue: round(grossCurrentValue),
    grossExitValue: round(grossExitValue),
    totalFees: round(entryFees + exitFees),
    slippageCost: round(slippageCost),
    totalCost: round(totalCost),
    breakEvenPrice: round(breakEvenPrice, 4),
    currentValue: round(currentValue),
    currentPnl: round(currentPnl),
    currentPnlPercent: round(currentPnlPercent),
    netProceeds: round(netProceeds),
    pnl: round(pnl),
    pnlPercent: round(pnlPercent),
    roiAfterFees: round(roiAfterFees),
    marginUsed: round(marginUsed),
    liquidationPrice: round(liquidationPrice, 4)
  };
}

export function buildScenarioRows(input: TradeInput): ScenarioRow[] {
  const scenarios = [
    { label: "Bear", price: input.currentPrice * 0.88 },
    { label: "Base", price: input.sellPrice || input.currentPrice },
    { label: "Bull", price: (input.sellPrice || input.currentPrice) * 1.12 }
  ];

  return scenarios.map((scenario) => {
    const summary = calculateTradeSummary({ ...input, sellPrice: scenario.price });
    return {
      label: scenario.label,
      price: round(scenario.price, 4),
      pnl: round(summary.pnl),
      roi: round(summary.roiAfterFees)
    };
  });
}

export function buildProjectionSeries(input: TradeInput): ProjectionPoint[] {
  const quantity = getEffectiveQuantity(input);
  const priceSteps = [0.82, 0.92, 1, 1.08, 1.18];

  return priceSteps.map((step, index) => {
    const simulatedPrice = round(input.currentPrice * step, 4);
    const value = quantity * simulatedPrice;
    const pnl = calculateTradeSummary({ ...input, sellPrice: simulatedPrice }).pnl;
    return {
      label: ["Stress", "Pullback", "Spot", "Momentum", "Breakout"][index],
      price: simulatedPrice,
      value: round(value),
      pnl: round(pnl)
    };
  });
}

export function calculateDcaSummary(input: DcaInput): DcaSummary {
  const periodsPerYear =
    input.frequency === "weekly" ? 52 : input.frequency === "biweekly" ? 26 : 12;
  const ratePerPeriod =
    Math.pow(1 + input.annualGrowthPercent / 100, 1 / periodsPerYear) - 1;

  let currentPrice = input.startingPrice;
  let totalInvested = 0;
  let totalUnits = 0;
  const series: DcaPoint[] = [];

  for (let i = 1; i <= input.periods; i += 1) {
    totalInvested += input.recurringAmount;
    totalUnits += input.recurringAmount / Math.max(currentPrice, 0.0001);
    const value = totalUnits * currentPrice;
    series.push({
      step: `${i}`,
      invested: round(totalInvested),
      value: round(value),
      units: round(totalUnits, 6),
      price: round(currentPrice, 4)
    });
    currentPrice *= 1 + ratePerPeriod;
  }

  const finalValue = totalUnits * currentPrice;
  const gain = finalValue - totalInvested;

  return {
    totalInvested: round(totalInvested),
    totalUnits: round(totalUnits, 6),
    averageCost: totalUnits > 0 ? round(totalInvested / totalUnits, 4) : 0,
    finalValue: round(finalValue),
    gain: round(gain),
    gainPercent: totalInvested > 0 ? round((gain / totalInvested) * 100) : 0,
    series
  };
}

export function calculatePortfolioAllocation(
  totalValue: number,
  items: PortfolioAllocationItem[]
): PortfolioAllocationResult[] {
  return items.map((item) => ({
    ...item,
    amount: round((totalValue * item.percent) / 100)
  }));
}

export function calculateStakingSummary(input: StakingInput): StakingSummary {
  const periodsPerYear =
    input.compounding === "daily" ? 365 : input.compounding === "weekly" ? 52 : 12;
  const totalPeriods = Math.round((input.durationMonths / 12) * periodsPerYear);
  const ratePerPeriod = input.apyPercent / 100 / periodsPerYear;
  const finalBalance = input.principal * Math.pow(1 + ratePerPeriod, totalPeriods);
  const rewards = finalBalance - input.principal;

  return {
    finalBalance: round(finalBalance),
    rewards: round(rewards),
    monthlyIncome: round(rewards / Math.max(input.durationMonths, 1))
  };
}

export function calculateRiskRewardSummary(
  input: RiskRewardInput
): RiskRewardSummary {
  const riskPerUnit = Math.max(input.entryPrice - input.stopLoss, 0.0001);
  const rewardPerUnit = Math.max(input.takeProfit - input.entryPrice, 0);
  const capitalAtRisk = input.accountSize * (input.riskPercent / 100);
  const positionSize = capitalAtRisk / riskPerUnit;

  return {
    riskPerUnit: round(riskPerUnit, 4),
    rewardPerUnit: round(rewardPerUnit, 4),
    ratio: riskPerUnit > 0 ? round(rewardPerUnit / riskPerUnit, 2) : 0,
    capitalAtRisk: round(capitalAtRisk),
    positionSize: round(positionSize, 4),
    upsideValue: round(positionSize * rewardPerUnit),
    downsideValue: round(positionSize * riskPerUnit)
  };
}

export function calculateTakeProfitRows(
  input: TakeProfitPlannerInput
): TakeProfitRow[] {
  return [
    { label: "Trim 1", targetPrice: input.target1 },
    { label: "Trim 2", targetPrice: input.target2 },
    { label: "Final", targetPrice: input.target3 }
  ].map((row) => ({
    label: row.label,
    targetPrice: round(row.targetPrice, 4),
    gainPerUnit: round(row.targetPrice - input.entryPrice, 4),
    grossValue: round(row.targetPrice * input.positionSize)
  }));
}

export function calculateLiquidationEstimate(input: LiquidationInput) {
  const maintenanceRate = input.maintenanceMarginPercent / 100;
  const leverageBuffer = 1 / Math.max(input.leverage, 1);
  if (input.positionType === "short") {
    return round(input.entryPrice * (1 + leverageBuffer - maintenanceRate), 4);
  }
  return round(
    Math.max(0, input.entryPrice * (1 - leverageBuffer + maintenanceRate)),
    4
  );
}

export function calculateTaxEstimate(
  input: TaxEstimateInput
): TaxEstimateResult {
  const longHoldDiscount = input.holdingMonths >= 12 ? 0.8 : 1;
  const effectiveRate = input.estimatedTaxRate * longHoldDiscount;
  const taxAmount = input.gains * (effectiveRate / 100);
  return {
    taxAmount: round(taxAmount),
    effectiveRate: round(effectiveRate),
    afterTaxGain: round(input.gains - taxAmount)
  };
}

export function parseTradePrompt(
  text: string,
  assets: string[],
  fiatCodes: string[]
): ParsedPrompt {
  const normalized = text.toUpperCase();
  const parsed: ParsedPrompt = {};

  const assetMatch = assets.find((asset) => normalized.includes(asset));
  if (assetMatch) {
    parsed.asset = assetMatch;
  }

  const fiatMatch = fiatCodes.find((fiat) => normalized.includes(fiat));
  if (fiatMatch) {
    parsed.fiat = fiatMatch;
  } else if (normalized.includes("$")) {
    parsed.fiat = "USD";
  }

  const quantityMatch = text.match(/(?:quantity|qty|buy|long|short)\s*:?\s*(\d+(\.\d+)?)/i);
  if (quantityMatch) {
    parsed.quantity = Number(quantityMatch[1]);
  }

  const amountMatch = text.match(/\$ ?(\d[\d,]*(\.\d+)?)/i);
  if (amountMatch) {
    parsed.amount = Number(amountMatch[1].replaceAll(",", ""));
  }

  const buyMatch = text.match(/(?:buy|bought at|entry|entry price)\s*:?\s*(\d+(\.\d+)?)/i);
  if (buyMatch) {
    parsed.buyPrice = Number(buyMatch[1]);
  }

  const currentMatch = text.match(/(?:current|now|spot|current price)\s*:?\s*(\d+(\.\d+)?)/i);
  if (currentMatch) {
    parsed.currentPrice = Number(currentMatch[1]);
  }

  const sellMatch = text.match(/(?:sell|target|take profit|tp)\s*:?\s*(\d+(\.\d+)?)/i);
  if (sellMatch) {
    parsed.sellPrice = Number(sellMatch[1]);
  }

  const leverageMatch = text.match(/(\d+(\.\d+)?)\s*x/i);
  if (leverageMatch) {
    parsed.leverage = Number(leverageMatch[1]);
  }

  const feeMatch = text.match(/(\d+(\.\d+)?)\s*%?\s*fees?/i);
  if (feeMatch) {
    parsed.feesPercent = Number(feeMatch[1]);
  }

  const slippageMatch = text.match(/(\d+(\.\d+)?)\s*%?\s*slippage/i);
  if (slippageMatch) {
    parsed.slippagePercent = Number(slippageMatch[1]);
  }

  return parsed;
}
