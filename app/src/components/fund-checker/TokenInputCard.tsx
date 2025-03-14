
import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Button, Input } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";

interface TokenInputCardProps {
    tokenTicker: string;
    setTokenTicker: (value: string) => void;
    kaspaAddress: string;
    setKaspaAddress: (value: string) => void;
    fetchTokenData: () => Promise<any>;
    handleFetchBalance: () => Promise<void>;
    autocompleteItems: any[];
    loading: boolean;
}

export function TokenInputCard({
                                   setTokenTicker,
                                   kaspaAddress,
                                   setKaspaAddress,
                                   fetchTokenData,
                                   handleFetchBalance,
                                   autocompleteItems,
                                   loading
                               }: TokenInputCardProps) {
    return (
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
                        onSelectionChange={(key) => setTokenTicker(key as string)}
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
                        disabled={loading}
                        onClick={fetchTokenData}
                    >
                        {loading ? "Loading..." : "Fetch Token Data"}
                    </Button>
                    <Button
                        className="w-full mt-2 text-black font-bold py-1 px-2 text-sm"
                        color="primary"
                        disabled={loading}
                        onClick={handleFetchBalance}
                    >
                        {loading ? "Loading..." : "Fetch Balance"}
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}