
import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { InfoCard } from "../ui/InfoCard";
import { Hash, Coins, Users, Wallet } from "lucide-react";
import { AppState } from "@/types/fund";
import { isTokenUnused } from "@/utils/api";

interface ResultCardProps {
    state: AppState;
    calculatedMaxSupply: string;
    calculatedBalance: string;
}

export function ResultCard({
                               state,
                               calculatedMaxSupply,
                               calculatedBalance
                           }: ResultCardProps) {



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
                    <p className="font-semibold text-lg">Token Required</p>
                    <p>Please input the token ticker.</p>
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
        <Card className="w-full bg-backcard-100 text-white md:col-span-1 p-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                <h2 className="text-3xl font-extrabold text-white mb-4">Result</h2>
            </CardHeader>
            <CardBody>
                {renderApiOutput()}
            </CardBody>
        </Card>
    );
}