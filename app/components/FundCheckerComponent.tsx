'use client';
import { Landmark, Info, TrendingUp, Users, DollarSign } from 'lucide-react';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, Input, Button } from '@nextui-org/react';

interface TokenData {
    [key: string]: any;
}

interface MarketData {
    marketcap?: string;
    holders?: number;
    tradingVolume?: string;
    priceUSD?: string;
    priceChange24h?: string;
    marketCapRank?: number;
}

export default function FundCheckerComponent() {
    const [tokenTicker, setTokenTicker] = useState('FUND');
    const [kaspaAddress, setKaspaAddress] = useState('');
    const [tokenData, setTokenData] = useState<TokenData | null>(null);
    const [marketData, setMarketData] = useState<MarketData | null>(null);
    const [balanceData, setBalanceData] = useState<TokenData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTokenData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.kasplex.org/v1/krc20/token/${tokenTicker}`);
            if (!response.ok) {
                throw new Error('Failed to fetch token data');
            }
            const data = await response.json();
            setTokenData(data);
        } catch (error) {
            setError('Error fetching token data');
            console.error('Error fetching token data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMarketData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.kasplex.org/v1/krc20/token/${tokenTicker}/market`);
            if (!response.ok) {
                throw new Error('Failed to fetch market data');
            }
            const data = await response.json();
            setMarketData(data);
        } catch (error) {
            setError('Error fetching market data');
            console.error('Error fetching market data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBalanceData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.kasplex.org/v1/krc20/address/${kaspaAddress}/token/${tokenTicker}`);
            if (!response.ok) {
                throw new Error('Failed to fetch balance data');
            }
            const data = await response.json();
            setBalanceData(data);
        } catch (error) {
            setError('Error fetching balance data');
            console.error('Error fetching balance data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFetchTokenData = () => {
        fetchTokenData();
        fetchMarketData();
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Token Description Card */}
                <Card className="w-full bg-backcard-100 text-white md:col-span-1 p-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                        <h1 className="text-3xl text-center text-white font-extrabold">$FUND Checker</h1>
                    </CardHeader>
                    <CardBody>
                        <div className="bg-backcard-100 rounded-lg p-4 mb-4">
                            <h2 className="text-xl text-white mb-2 flex items-center">
                                <Info className="size-6 mr-1" /> About <span className="text-white font-bold ml-1 mr-1"> $FUND </span> Token
                            </h2>
                            <p className="text-gray-300">
                                A decentralized source of funding and utility.
                            </p>
                            <p className="text-gray-300 mt-2">
                                We stand out by continually working on decentralization, utility, and showing in a jungle of memes.
                                <span className="font-bold text-white"> $FUND </span> isn't just an average <span className="font-bold text-white">KRC20</span> token.
                                We are a great community with support and offering support in the Kaspa ecosystem.
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
                        <h2 className="text-3xl font-extrabold text-white mb-4">Market Information</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-4">
                            {/* Market Cap */}
                            <div className="bg-backcard-100 rounded-lg p-3 flex items-center">
                                <DollarSign className="mr-3 text-teal-400" />
                                <div>
                                    <h3 className="text-sm text-gray-300">Market Cap</h3>
                                    <p className="font-bold text-white">{marketData?.marketcap || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="bg-backcard-100 rounded-lg p-3 flex items-center">
                                <TrendingUp className="mr-3 text-green-400" />
                                <div>
                                    <h3 className="text-sm text-gray-300">Current Price</h3>
                                    <p className="font-bold text-white">{marketData?.priceUSD ? `$${marketData.priceUSD}` : 'N/A'}</p>
                                </div>
                            </div>

                            {/* Holders */}
                            <div className="bg-backcard-100 rounded-lg p-3 flex items-center">
                                <Users className="mr-3 text-blue-400" />
                                <div>
                                    <h3 className="text-sm text-gray-300">Total Holders</h3>
                                    <p className="font-bold text-white">{marketData?.holders || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Trading Volume */}
                            <div className="bg-backcard-100 rounded-lg p-3 flex items-center">
                                <Landmark className="mr-3 text-purple-400" />
                                <div>
                                    <h3 className="text-sm text-gray-300">Trading Volume</h3>
                                    <p className="font-bold text-white">{marketData?.tradingVolume || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="bg-backcard-100 rounded-lg p-3">
                                <h3 className="text-sm text-gray-300 mb-2">Additional Market Details</h3>
                                <div className="text-white">
                                    <p><strong>Market Cap Rank:</strong> {marketData?.marketCapRank || 'N/A'}</p>
                                    <p><strong>24h Price Change:</strong> {marketData?.priceChange24h ? `${marketData.priceChange24h}%` : 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Input Section */}
                <Card className="w-full bg-backcard-100 text-white md:col-span-1 p-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                        <h2 className="text-3xl font-extrabold text-white mb-4">Fetch Token Data</h2>
                    </CardHeader>
                    <CardBody className="flex flex-col items-center">
                        <div className="mb-4 w-full max-w-xs">
                            <Input
                                variant="faded"
                                type="text"
                                label="Token Ticker"
                                value={tokenTicker}
                                onValueChange={setTokenTicker}
                                placeholder="Enter token ticker (e.g. FUND)"
                                className="w-full text-white border-none shadow-sm"
                            />
                            <Button
                                color="primary"
                                className="w-full mt-2 text-black font-bold py-1 px-2 text-sm"
                                onClick={handleFetchTokenData}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Fetch Token Data'}
                            </Button>
                        </div>

                        <div className="mb-4 w-full max-w-xs">
                            <Input
                                variant="faded"
                                type="text"
                                label="Kaspa Address"
                                value={kaspaAddress}
                                onValueChange={setKaspaAddress}
                                placeholder="Enter your Kaspa address"
                                className="w-full text-white border-none shadow-sm"
                            />
                            <Button
                                color="secondary"
                                className="w-full mt-2 text-black font-bold py-1 px-2 text-sm"
                                onClick={fetchBalanceData}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Fetch Balance'}
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Output Data */}
                <Card className="w-full bg-backcard-100 text-white md:col-span-1 p-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
                        <h2 className="text-3xl font-extrabold text-white mb-2">API Output</h2>
                    </CardHeader>
                    <CardBody>
                        {tokenData && (
                            <div className="bg-backcard-100 rounded-lg p-4 mb-4">
                                <h2 className="text-xl font-semibold text-white mb-2">Token Data</h2>
                                <pre className="bg-black p-2 rounded overflow-x-auto text-xs">
                                    {JSON.stringify(tokenData, null, 2)}
                                </pre>
                            </div>
                        )}

                        {balanceData && (
                            <div className="bg-backcard-100 rounded-lg p-4">
                                <h2 className="text-xl font-semibold text-white mb-2">Token Balance</h2>
                                <pre className="bg-black p-2 rounded overflow-x-auto text-xs">
                                    {JSON.stringify(balanceData, null, 2)}
                                </pre>
                            </div>
                        )}

                        {error && <div className="text-red-500 mt-4">{error}</div>}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
