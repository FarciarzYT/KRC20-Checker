"use client";
import {
  Coins,
  DollarSign,
  Hash,
  Info,
  Landmark,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import {
  Autocomplete,
  AutocompleteItem
} from "@heroui/autocomplete";

import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import BigNumber from "bignumber.js";

const API_BASE_URL = "https://api.kasplex.org/v1";
const XEGGEX_BASE_URL = "https://api.xeggex.com/api/v2";
const DEFAULT_TOKEN_TICKER = "FUND";

interface TokenResult {
  tick: string;
  max: string;
  dec: string;
  balance?: string;
  holderTotal: string;
  state?: string;
}

interface TokenResponse {
  result: TokenResult[];
}

interface MarketData {
  marketcap: string;
  holders?: number;
  tradingVolume: string;
  priceUSD: string;
  priceChange24h: string;
  marketCapRank?: number;
  previous_day_price:string;
}

interface AppState {
  tokenData: TokenResponse | null;
  marketData: MarketData | null;
  balanceData: TokenResponse | null;
  loading: boolean;
  error: string | null;
}

interface XeggexTicker {
  ticker_id: string;
  base_currency: string;
  target_currency: string;
  last_price: string;
  base_volume: string;
  usd_volume_est: string;
  change_percent: string;
  high: string;
  low: string;
}

export default function FundChecker() {
  const [tokenTicker, setTokenTicker] = useState(DEFAULT_TOKEN_TICKER);
  const [kaspaAddress, setKaspaAddress] = useState("");
  const [state, setState] = useState<AppState>({
    tokenData: null,
    marketData: null,
    balanceData: null,
    loading: false,
    error: null,
  });
  const [autocompleteItems, setAutocompleteItems] = useState([]);

  const fetchTickers = useCallback(async () => {
    try {
      const response = await fetch(`${XEGGEX_BASE_URL}/tickers`);
      if (!response.ok) {
        throw new Error("Failed to fetch tickers");
      }
      const data = await response.json();

      const filteredTickers = data.filter((ticker: XeggexTicker) =>
          ticker.target_currency === "FUND"
      );

      setAutocompleteItems(filteredTickers.map((ticker: XeggexTicker) => ({
        label: ticker.base_currency,
        key: ticker.base_currency,
      })));
    } catch (error) {
      console.error("Error fetching tickers:", error);
    }
  }, []);

  const fetchMarketData = useCallback(async () => {
    try {
      const response = await fetch(`${XEGGEX_BASE_URL}/tickers`);
      if (!response.ok) {
        throw new Error("Failed to fetch market data");
      }
      const data = await response.json();

      // Find FUND market data (prioritize USDT pair if available)
      const fundMarket = data.find((ticker: XeggexTicker) =>
          ticker.base_currency === "FUND" && ticker.target_currency === "USDT"
      ) || data.find((ticker: XeggexTicker) =>
          ticker.base_currency === "FUND"
      );

      if (fundMarket) {
        const marketData: MarketData = {
          marketcap: new BigNumber(fundMarket.last_price).multipliedBy(2100000).toFixed(2),
          priceUSD: fundMarket.last_price,
          tradingVolume: fundMarket.usd_volume_est,
          priceChange24h: fundMarket.change_percent,
          previous_day_price: fundMarket.previous_day_price
        };

        setState(prev => ({
          ...prev,
          marketData
        }));
      }
    } catch (error) {
      console.error("Error fetching market data:", error);
      handleError(error);
    }
  }, []);

  useEffect(() => {
    fetchTickers();
    fetchMarketData();
    // Refresh market data every 30 seconds
    const intervalId = setInterval(fetchMarketData, 30000);
    return () => clearInterval(intervalId);
  }, [fetchTickers, fetchMarketData]);

  const handleError = (error: unknown) => {
    const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
    if (!errorMessage.includes("mismatch")) {
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const validateTokenMatch = (
      tokenData: TokenResponse,
      balanceData: TokenResponse,
  ) => {
    if (!tokenData.result?.[0] || !balanceData.result?.[0]) {
      return false;
    }
    return (
        tokenData.result[0].tick.toLowerCase() ===
        balanceData.result[0].tick.toLowerCase()
    );
  };

  const isTokenUnused = (tokenData: TokenResponse) => {
    return tokenData.result?.[0]?.state === "unused";
  };

  const fetchTokenData = useCallback(async () => {
    if (!tokenTicker.trim()) {
      setState((prev) => ({ ...prev, error: "Token ticker is required" }));
      return null;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(
          `${API_BASE_URL}/krc20/token/${tokenTicker}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch token data");
      }
      const data = await response.json();

      if (isTokenUnused(data)) {
        setState((prev) => ({
          ...prev,
          error: `Token ${tokenTicker} does not exist or is unused`,
          loading: false,
          tokenData: null,
          balanceData: null,
        }));
        return null;
      }

      setState((prev) => ({
        ...prev,
        tokenData: data,
        loading: false,
      }));

      return data;
    } catch (error) {
      handleError(error);
      return null;
    }
  }, [tokenTicker]);

  const fetchBalanceData = useCallback(async (tokenData: TokenResponse | null = null) => {
    if (!kaspaAddress.trim()) {
      setState((prev) => ({ ...prev, error: "Kaspa address is required" }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const currentTokenData = tokenData || state.tokenData || await fetchTokenData();

      if (!currentTokenData) {
        throw new Error("Unable to fetch token data");
      }

      if (isTokenUnused(currentTokenData)) {
        setState((prev) => ({
          ...prev,
          error: `Token ${tokenTicker} does not exist or is unused`,
          loading: false,
          balanceData: null,
        }));
        return;
      }

      const response = await fetch(
          `${API_BASE_URL}/krc20/address/${kaspaAddress}/token/${tokenTicker}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch balance data");
      }

      const data = await response.json();

      if (!validateTokenMatch(currentTokenData, data)) {
        const newTokenData = await fetchTokenData();
        if (newTokenData) {
          setState((prev) => ({
            ...prev,
            tokenData: newTokenData,
            balanceData: data,
            loading: false,
          }));
        }
      } else {
        setState((prev) => ({
          ...prev,
          tokenData: currentTokenData,
          balanceData: data,
          loading: false,
        }));
      }
    } catch (error) {
      handleError(error);
    }
  }, [kaspaAddress, tokenTicker, state.tokenData, fetchTokenData]);

  const handleFetchBalance = async () => {
    if (!state.tokenData) {
      const tokenData = await fetchTokenData();
      if (tokenData) {
        await fetchBalanceData(tokenData);
      }
    } else {
      await fetchBalanceData();
    }
  };

  const calculatedBalance = useMemo(() => {
    if (
        !state.balanceData?.result[0]?.balance ||
        !state.tokenData?.result[0]?.dec ||
        !validateTokenMatch(state.tokenData, state.balanceData)
    ) {
      return "N/A";
    }
    const balance = new BigNumber(state.balanceData.result[0].balance);
    const decimals = state.tokenData.result[0].dec;

    return balance.shiftedBy(-decimals).toFixed(3);
  }, [state.balanceData, state.tokenData]);

  const calculatedMaxSupply = useMemo(() => {
    if (!state.tokenData?.result[0]?.max || !state.tokenData?.result[0]?.dec) {
      return "N/A";
    }

    const maxSupply = new BigNumber(state.tokenData.result[0].max);
    const decimals = state.tokenData.result[0].dec;

    return maxSupply.shiftedBy(-decimals).toFixed();
  }, [state.tokenData]);

  const InfoCard = ({
                      icon: Icon,
                      value,
                      label,
                    }: {
    title?: string;
    icon: any;
    value: string | number;
    label: string;
  }) => (
      <div className="bg-backcard-100 rounded-lg p-3 flex items-center">
        <Icon className="mr-3 text-teal-400" />
        <div>
          <h3 className="text-sm text-gray-300">{label}</h3>
          <p className="font-bold text-white">{value}</p>
        </div>
      </div>
  );

  const renderApiOutput = () => {
    if (state.loading) {
      return <p className="text-gray-300">Fetching data... Please wait.</p>;
    }

    if (state.error) {
      return (
          <div
              className="bg-red-400 border border-red-500 text-white px-4 py-3 rounded-2xl relative font-bold"
              role="alert"
          >
            {state.error}
          </div>
      );
    }

    if (!state.tokenData?.result?.length || isTokenUnused(state.tokenData)) {
      return (
          <div className="text-gray-300 text-center">
            <p className="font-semibold text-lg">Token not found!</p>
            <p>The requested token does not exist or is not in use.</p>
          </div>
      );
    }

    return (
        <div className="space-y-4">
          {state.tokenData?.result?.[0] && (
              <>
                <InfoCard
                    icon={Hash}
                    label="Token Symbol"
                    value={state.tokenData.result[0].tick || "N/A"}
                />
                <InfoCard
                    icon={Coins}
                    label="Total Supply"
                    value={calculatedMaxSupply || "N/A"}
                />
                <InfoCard
                    icon={Users}
                    label="Total Holders"
                    value={state.tokenData?.result[0]?.holderTotal || "N/A"}
                />
              </>
          )}
          <hr className="border-gray-700" />
          {state.balanceData?.result?.[0] && state.tokenData?.result?.[0] && (
              <InfoCard
                  icon={Wallet}
                  label="Balance"
                  value={`${calculatedBalance} ${state.tokenData.result[0].tick}`}
              />
          )}
        </div>
    );
  };

  return (
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Token Description Card */}
          <Card className="w-full bg-backcard-100 text-white md:col-span-1 p-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
              <h1 className="text-3xl text-center text-white font-extrabold">
                $FUND Checker
              </h1>
            </CardHeader>
            <CardBody>
              <div className="bg-backcard-100 rounded-lg p-4 mb-4">
                <h2 className="text-xl text-white mb-2 flex items-center">
                  <Info className="size-6 mr-1" /> About{" "}
                  <span className="text-white font-bold ml-1 mr-1"> $FUND </span>{" "}
                  Token
                </h2>
                <p className="text-gray-300">
                  A decentralized source of funding and utility.
                </p>
                <p className="text-gray-300 mt-2">
                  We stand out by continually working on decentralization,
                  utility, and showing in a jungle of memes.
                  <span className="font-bold text-white"> $FUND </span> isn't
                  an average <span className="font-bold text-white">KRC20</span>{" "}
                  token. We are a great community with support and offering
                  support in the Kaspa ecosystem.
                </p>
                <div className="mt-4 text-gray-300">
                  <strong>Total Supply:</strong> 2.1M <br />
                  <strong>Total Mints:</strong> 2,100 <br />
                  <strong>Launch Type:</strong> Fair Launch <br />
                  <strong>Community:</strong> Community Run <br />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Market Information Card */}
          <Card className="w-full bg-backcard-100 text-white md:col-span-1 p-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
              <h2 className="text-3xl font-extrabold text-white mb-4">
                FUND Market Info
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <InfoCard
                    icon={DollarSign}
                    label="Market Cap"
                    value={state.marketData?.marketcap ? `$${state.marketData.marketcap}` : "N/A"}
                />
                <InfoCard
                    icon={TrendingUp}
                    label="Last Price"
                    value={state.marketData?.priceUSD ? `$${state.marketData.priceUSD}` : "N/A"}
                />
                <InfoCard
                    icon={Landmark}
                    label="Trading Volume"
                    value={state.marketData?.tradingVolume ? `$${state.marketData.tradingVolume}` : "N/A"}
                />
                <div className="bg-backcard-100 rounded-lg p-3">
                  <h3 className="text-sm text-gray-300 mb-2">
                    Additional Market Details
                  </h3>
                  <div className="text-white">
                    <p>
                      <strong>Previous Day Price</strong>{" "}
                      {state.marketData?.previous_day_price || "N/A"}
                    </p>
                    <p>
                      <strong>24h Price Change:</strong>{" "}
                      {state.marketData?.priceChange24h ? `${state.marketData.priceChange24h}%` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Input Section */}
          <Card className="w-full bg-backcard-100 text-white md:col-span-1 p-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Fetch Token Data
              </h2>
            </CardHeader>
            <CardBody className="flex flex-col items-center">
              <div className="mb-4 w-full max-w-xs">
                <Autocomplete
                    placeholder="Enter token ticker (e.g. FUND)"
                    defaultItems={autocompleteItems}
                    aria-label="Token Ticker Input"
                    className="w-full text-white border-none shadow-sm"
                    label="Token Ticker"
                    type="text"
                    variant="faded"
                    //@ts-ignore
                    onSelectionChange={setTokenTicker}
                    onValueChange={setTokenTicker}
                    isRequired={true}
                >
                  {(item: any) => (
                      <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
                  )}
                </Autocomplete>
              </div>

              <div className="mb-4 w-full max-w-xs">
                <Input
                    aria-label="Kaspa Address Input"
                    className="w-full text-white border-none shadow-sm"
                    label="Kaspa Address"
                    placeholder="Enter your Kaspa address"
                    type="text"
                    value={kaspaAddress}
                    variant="faded"
                    onValueChange={setKaspaAddress}
                />
                <Button
                    className="w-full mt-2 text-black font-bold py-1 px-2 text-sm mb-3"
                    color="primary"
                    disabled={state.loading}
                    onClick={fetchTokenData}
                >
                  {state.loading ? "Loading..." : "Fetch Token Data"}
                </Button>
                <Button
                    className="w-full mt-2 text-black font-bold py-1 px-2 text-sm"
                    color="primary"
                    disabled={state.loading}
                    onClick={handleFetchBalance}
                >
                  {state.loading ? "Loading..." : "Fetch Balance"}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* API Output Card */}
          <Card className="w-full bg-backcard-100 text-white md:col-span-1 p-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
              <h2 className="text-3xl font-extrabold text-white mb-4">Result</h2>
            </CardHeader>
            <CardBody>
              {renderApiOutput()}
            </CardBody>
          </Card>
        </div>
      </div>
  );
}