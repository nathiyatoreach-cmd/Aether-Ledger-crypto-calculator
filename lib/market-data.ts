import { CRYPTO_ASSETS, FIAT_CURRENCIES } from "@/lib/constants";
import { AssetPrice, MarketState } from "@/lib/types";

function buildMockPrice(symbol: string): AssetPrice {
  const asset = CRYPTO_ASSETS.find((item) => item.symbol === symbol);
  const usd = asset?.demoPrice ?? 1;

  const fxRates: Record<string, number> = {
    USD: 1,
    AUD: 1.53,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 151.3,
    SGD: 1.35
  };

  const values = FIAT_CURRENCIES.reduce<Record<string, number>>((accumulator, fiat) => {
    accumulator[fiat.code] = Number((usd * (fxRates[fiat.code] ?? 1)).toFixed(4));
    return accumulator;
  }, {});

  return {
    symbol,
    values,
    change24h: Number((((usd % 11) - 5) * 1.36).toFixed(2)),
    source: "mock"
  };
}

export function buildMockMarketState(message = "Using polished demo prices."): MarketState {
  const prices = CRYPTO_ASSETS.reduce<Record<string, AssetPrice>>((accumulator, asset) => {
    accumulator[asset.symbol] = buildMockPrice(asset.symbol);
    return accumulator;
  }, {});

  return {
    status: "ready",
    source: "mock",
    lastUpdated: new Date().toISOString(),
    message,
    prices
  };
}

export async function fetchMarketPrices(): Promise<MarketState> {
  const baseUrl =
    process.env.NEXT_PUBLIC_MARKET_API ?? "https://api.coingecko.com/api/v3";
  const ids = CRYPTO_ASSETS.map((item) => item.coingeckoId).join(",");
  const vsCurrencies = FIAT_CURRENCIES.map((item) => item.code.toLowerCase()).join(",");
  const url = `${baseUrl}/simple/price?ids=${ids}&vs_currencies=${vsCurrencies}&include_24hr_change=true`;

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Price provider returned ${response.status}`);
    }

    const payload = (await response.json()) as Record<string, Record<string, number>>;

    const prices = CRYPTO_ASSETS.reduce<Record<string, AssetPrice>>((accumulator, asset) => {
      const raw = payload[asset.coingeckoId];
      if (!raw) {
        accumulator[asset.symbol] = buildMockPrice(asset.symbol);
        return accumulator;
      }

      const values = FIAT_CURRENCIES.reduce<Record<string, number>>(
        (fiatAccumulator, fiat) => {
          fiatAccumulator[fiat.code] = Number(
            (raw[fiat.code.toLowerCase()] ?? asset.demoPrice).toFixed(6)
          );
          return fiatAccumulator;
        },
        {}
      );

      accumulator[asset.symbol] = {
        symbol: asset.symbol,
        values,
        change24h: Number((raw.usd_24h_change ?? 0).toFixed(2)),
        source: "live"
      };

      return accumulator;
    }, {});

    return {
      status: "ready",
      source: "live",
      lastUpdated: new Date().toISOString(),
      message: "Live CoinGecko data connected.",
      prices
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Live pricing unavailable";
    return {
      ...buildMockMarketState("Live price fetch failed. Demo prices are active."),
      source: "mock",
      message,
      status: "error"
    };
  }
}
