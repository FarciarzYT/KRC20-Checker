

import { useState, useCallback, useEffect, useMemo } from "react";
import BigNumber from "bignumber.js";
import {
    AppState,
    TokenResponse,
    MarketData,
} from "@/types/fund";
import {
    fetchTokenData as apiFetchTokenData,
    fetchBalanceData as apiFetchBalanceData,
    fetchTickers as apiFetchTickers,
    fetchMarketData as apiFetchMarketData,
    DEFAULT_TOKEN_TICKER,
    validateTokenMatch,
    isTokenUnused,
} from "@/utils/api";

export function useFundData() {
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
        const tickers = await apiFetchTickers();
        setAutocompleteItems(tickers);
    }, []);

    const fetchMarketData = useCallback(async () => {
        try {
            const marketData = await apiFetchMarketData();
            if (marketData) {
                setState((prev) => ({
                    ...prev,
                    marketData,
                }));
            }
        } catch (error) {
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

    const fetchTokenData = useCallback(async () => {
        if (!tokenTicker.trim()) {
            setState((prev) => ({ ...prev, error: "Token ticker is required" }));
            return null;
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
            const data = await apiFetchTokenData(tokenTicker);

            if (data && isTokenUnused(data)) {
                setState((prev) => ({
                    ...prev,
                    error: `Token ${tokenTicker} does not exist`,
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

    const fetchBalanceData = useCallback(
        async (tokenData: TokenResponse | null = null) => {
            if (!kaspaAddress.trim()) {
                setState((prev) => ({ ...prev, error: "Kaspa address is required" }));
                return;
            }

            setState((prev) => ({ ...prev, loading: true, error: null }));

            try {
                const currentTokenData =
                    tokenData || state.tokenData || (await fetchTokenData());

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

                const data = await apiFetchBalanceData(
                    kaspaAddress,
                    tokenTicker,
                    currentTokenData
                );

                if (data && !validateTokenMatch(currentTokenData, data)) {
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
        },
        [kaspaAddress, tokenTicker, state.tokenData, fetchTokenData]
    );

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

    return {
        state,
        tokenTicker,
        setTokenTicker,
        kaspaAddress,
        setKaspaAddress,
        fetchTokenData,
        handleFetchBalance,
        calculatedBalance,
        calculatedMaxSupply,
        autocompleteItems,
    };
}