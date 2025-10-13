'use client';

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RequestCryptocurrencyPage() {
    const [network, setNetwork] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [cryptoName, setCryptoName] = useState('');
    const [cryptoSymbol, setCryptoSymbol] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log({
            network,
            contractAddress,
            cryptoName,
            cryptoSymbol,
        });
    };

    return (
        <div className="flex justify-center items-center h-full">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Request Cryptocurrency</CardTitle>
                    <CardDescription>
                        If your desired exchange cryptocurrency is not listed, fill the form to request coin listing on bytexp2p.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="network">Network</Label>
                            <Input
                                id="network"
                                value={network}
                                onChange={(e) => setNetwork(e.target.value)}
                                placeholder="Enter network (E.g BEP20, ERC20, TRC20)"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contract-address">Contract Address</Label>
                            <Input
                                id="contract-address"
                                value={contractAddress}
                                onChange={(e) => setContractAddress(e.target.value)}
                                placeholder="Paste contract address"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="crypto-name">Crypto Name</Label>
                            <Input
                                id="crypto-name"
                                value={cryptoName}
                                onChange={(e) => setCryptoName(e.target.value)}
                                placeholder="e.g Bitcoin, Ethereum"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="crypto-symbol">Crypto Symbol</Label>
                            <Input
                                id="crypto-symbol"
                                value={cryptoSymbol}
                                onChange={(e) => setCryptoSymbol(e.target.value)}
                                placeholder="E.g BTC, ETH, ADA, XRP"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
