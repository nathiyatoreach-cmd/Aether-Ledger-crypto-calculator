import {
  AssistantResult,
  PortfolioAllocationResult,
  ScenarioRow,
  TradeInput,
  TradeSummary
} from "@/lib/types";
import { formatCompactCurrency, formatPercent } from "@/lib/utils";

export function fallbackAssistantResponse(params: {
  task: "explain" | "compare" | "portfolio" | "sentiment" | "risk";
  tradeInput: TradeInput;
  tradeSummary: TradeSummary;
  scenarios: ScenarioRow[];
  allocations: PortfolioAllocationResult[];
  providerName: string;
}): AssistantResult {
  const { task, tradeInput, tradeSummary, scenarios, allocations, providerName } = params;

  const explain = [
    `${tradeInput.asset} is being modeled as a ${tradeInput.leverage}x position with ${tradeSummary.effectiveQuantity} units and a planned exit near ${tradeInput.sellPrice}.`,
    `At the modeled exit, the trade is targeting ${formatCompactCurrency(
      tradeSummary.netProceeds,
      tradeInput.fiat
    )} in net proceeds and ${formatPercent(tradeSummary.roiAfterFees)} return on margin after fees.`,
    `The setup stays efficient while price remains above the ${tradeSummary.breakEvenPrice.toFixed(
      2
    )} break-even zone and becomes fragile if slippage expands beyond the current estimate.`
  ].join(" ");

  const compare = scenarios
    .map(
      (scenario) =>
        `${scenario.label}: exit ${scenario.price.toFixed(2)}, P/L ${formatCompactCurrency(
          scenario.pnl,
          tradeInput.fiat
        )}, ROI ${formatPercent(scenario.roi)}.`
    )
    .join(" ");

  const portfolio = [
    `The portfolio is currently tilted toward offense with ${allocations
      .slice(0, 3)
      .map((item) => `${item.symbol} at ${item.percent}%`)
      .join(", ")}.`,
    `That mix gives strong upside beta, while the ${allocations
      .filter((item) => item.symbol.includes("USD"))
      .map((item) => `${item.percent}% stable allocation`)
      .join(", ")} adds dry powder for pullbacks.`,
    `A balanced next step would be trimming winners into stablecoins rather than chasing size with fresh leverage.`
  ].join(" ");

  const sentiment = [
    `This sentiment snapshot only uses the market panel data already in the app.`,
    `Price action leans constructive because the base scenario stays above break-even and the upside branch produces a larger expansion than the downside branch.`,
    `Treat it as tactical sentiment, not market truth, until it is confirmed by your own volume, structure, and risk rules.`
  ].join(" ");

  const risk = [
    `The main risk is not direction, it is position efficiency.`,
    `Leverage compresses the liquidation buffer toward ${tradeSummary.liquidationPrice.toFixed(
      2
    )}, so the trade should only stay active while the thesis remains precise.`,
    `Before entering, answer three questions: what invalidates the setup, where will you take first size off, and what condition forces you to sit out rather than average down?`
  ].join(" ");

  const contentMap = {
    explain,
    compare,
    portfolio,
    sentiment,
    risk
  };

  return {
    content: contentMap[task],
    providerUsed: providerName || "Demo strategist",
    mode: "demo"
  };
}
