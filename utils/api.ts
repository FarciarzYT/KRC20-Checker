
import BigNumber from "bignumber.js";
import { TokenResponse, XeggexTicker, MarketData } from "@/types/fund";

export const API_BASE_URL = "https://api.kasplex.org/v1";
export const XEGGEX_BASE_URL = "https://api.xeggex.com/api/v2";
export const DEFAULT_TOKEN_TICKER = "FUND";

export const isTokenUnused = (tokenData: TokenResponse) => {
    return tokenData.result?.[0]?.state === "unused";
};

export const validateTokenMatch = (
    tokenData: TokenResponse,
    balanceData: TokenResponse
) => {
    if (!tokenData.result?.[0] || !balanceData.result?.[0]) {
        return false;
    }
    return (
        tokenData.result[0].tick.toLowerCase() ===
        balanceData.result[0].tick.toLowerCase()
    );
};

export async function fetchTickers() {
    try {
        const response = await fetch(`${XEGGEX_BASE_URL}/tickers`);
        if (!response.ok) {
            throw new Error("Failed to fetch tickers");
        }
        const data = await response.json();

        const filteredTickers = data.filter(
            (ticker: XeggexTicker) => ticker.target_currency === "FUND"
        );

        return filteredTickers.map((ticker: XeggexTicker) => ({
            label: ticker.base_currency,
            key: ticker.base_currency,
        }));
    } catch (error) {
        console.error("Error fetching tickers:", error);
        return [];
    }
}

export async function fetchMarketData(): Promise<MarketData | null> {
    try {
        const response = await fetch(`${XEGGEX_BASE_URL}/tickers`);
        if (!response.ok) {
            throw new Error("Failed to fetch market data");
        }
        const data = await response.json();

        const fundMarket =
            data.find(
                (ticker: XeggexTicker) =>
                    ticker.base_currency === "FUND" && ticker.target_currency === "USDT"
            ) ||
            data.find((ticker: XeggexTicker) => ticker.base_currency === "FUND");

        if (fundMarket) {
            const marketData: MarketData = {
                marketcap: new BigNumber(fundMarket.last_price)
                    .multipliedBy(2100000)
                    .toFixed(2),
                priceUSD: fundMarket.last_price,
                tradingVolume: fundMarket.usd_volume_est,
                priceChange24h: fundMarket.change_percent,
                previous_day_price: fundMarket.previous_day_price,
            };

            return marketData;
        }
        return null;
    } catch (error) {
        console.error("Error fetching market data:", error);
        return null;
    }
}

export async function fetchTokenData(
    tokenTicker: string
): Promise<TokenResponse | null> {
    if (!tokenTicker.trim()) {
        throw new Error("Token ticker is required");
    }

    try {
        const response = await fetch(`${API_BASE_URL}/krc20/token/${tokenTicker}`);

        if (!response.ok) {
            throw new Error("Failed to fetch token data");
        }
        const data = await response.json();

        if (isTokenUnused(data)) {
            throw new Error(`Token ${tokenTicker} does not exist`);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export async function fetchBalanceData(
    kaspaAddress: string,
    tokenTicker: string,
    tokenData: TokenResponse | null
): Promise<TokenResponse | null> {
    if (!kaspaAddress.trim()) {
        throw new Error("Kaspa address is required");
    }

    try {
        if (!tokenData) {
            throw new Error("Unable to fetch token data");
        }

        if (isTokenUnused(tokenData)) {
            throw new Error(`Token ${tokenTicker} does not exist`);
        }

        const response = await fetch(
            `${API_BASE_URL}/krc20/address/${kaspaAddress}/token/${tokenTicker}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch balance data");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}