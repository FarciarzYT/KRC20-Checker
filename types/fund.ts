

export interface TokenResult {
    tick: string;
    max: string;
    dec: string;
    balance?: string;
    holderTotal: string;
    state?: string;
}

export interface TokenResponse {
    result: TokenResult[];
}

export interface MarketData {
    marketcap: string;
    holders?: number;
    tradingVolume: string;
    priceUSD: string;
    priceChange24h: string;
    marketCapRank?: number;
    previous_day_price: string;
}

export interface AppState {
    tokenData: TokenResponse | null;
    marketData: MarketData | null;
    balanceData: TokenResponse | null;
    loading: boolean;
    error: string | null;
}

export interface XeggexTicker {
    ticker_id: string;
    base_currency: string;
    target_currency: string;
    last_price: string;
    base_volume: string;
    usd_volume_est: string;
    change_percent: string;
    high: string;
    low: string;
    previous_day_price: string;
}

export interface InfoCardProps {
    icon: React.ComponentType;
    value: string | number;
    label: string;
    title?: string;
}