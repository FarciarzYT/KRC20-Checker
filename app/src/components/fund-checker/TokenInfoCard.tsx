
import React from "react";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Info } from "lucide-react";

export function TokenInfoCard() {
    return (
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
    );
}