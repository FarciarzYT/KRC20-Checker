
"use client";

import React from "react";
import { TokenInfoCard } from "./TokenInfoCard";
import { MarketInfoCard } from "./MarketInfoCard";
import { TokenInputCard } from "./TokenInputCard";
import { ResultCard } from "./ResultCard";
import { useFundData } from "@/hooks/useFundData";

export default function FundChecker() {
    const {
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
    } = useFundData();

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1  md:grid-cols-4 gap-6">
                <TokenInfoCard />

                <MarketInfoCard marketData={state.marketData} />

                <TokenInputCard
                    tokenTicker={tokenTicker}
                    setTokenTicker={setTokenTicker}
                    kaspaAddress={kaspaAddress}
                    setKaspaAddress={setKaspaAddress}
                    fetchTokenData={fetchTokenData}
                    handleFetchBalance={handleFetchBalance}
                    autocompleteItems={autocompleteItems}
                    loading={state.loading}
                />

                <ResultCard
                    state={state}
                    calculatedMaxSupply={calculatedMaxSupply}
                    calculatedBalance={calculatedBalance}
                />
            </div>
        </div>
    );
}