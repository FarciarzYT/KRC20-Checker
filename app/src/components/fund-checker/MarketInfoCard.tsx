
import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { DollarSign, TrendingUp, Landmark } from "lucide-react";
import { InfoCard } from "../ui/InfoCard";
import { MarketData } from "@/types/fund";

interface MarketInfoCardProps {
    marketData: MarketData | null;
}

export function MarketInfoCard({ marketData }: MarketInfoCardProps) {
    return (
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
                        value={marketData?.marketcap ? `$${marketData.marketcap}` : "N/A"}
                    />
                    <InfoCard
                        icon={TrendingUp}
                        label="Last Price"
                        value={marketData?.priceUSD ? `$${marketData.priceUSD}` : "N/A"}
                    />
                    <InfoCard
                        icon={Landmark}
                        label="Trading Volume"
                        value={marketData?.tradingVolume ? `$${marketData.tradingVolume}` : "N/A"}
                    />
                    <div className="bg-backcard-100 rounded-lg p-3">
                        <h3 className="text-sm text-gray-300 mb-2">
                            Additional Market Details
                        </h3>
                        <div className="text-white">
                            <p>
                                <strong>Previous Day Price</strong>{" "}
                                {marketData?.previous_day_price || "N/A"}
                            </p>
                            <p>
                                <strong>24h Price Change:</strong>{" "}
                                {marketData?.priceChange24h ? `${marketData.priceChange24h}%` : "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}