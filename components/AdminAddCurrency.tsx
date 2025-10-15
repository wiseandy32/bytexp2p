'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function AdminAddCurrency() {
  const [coinName, setCoinName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [network, setNetwork] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        setError('File size cannot exceed 1MB.');
        setQrCode(null);
      } else {
        setError('');
        setQrCode(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) {
      setStatus('Please fix the errors before submitting.');
      return;
    }
    setStatus('Submitting...');
    // Here you would typically make an API call to your backend
    // to add the new cryptocurrency to your database.
    console.log({
      coinName,
      symbol,
      network,
      contractAddress,
      qrCode,
    });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus('Currency added successfully!');
    setCoinName('');
    setSymbol('');
    setNetwork('');
    setContractAddress('');
    setQrCode(null);
    setError('');
    // Reset the file input
    const fileInput = document.getElementById('qrCode') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Add New Cryptocurrency</h2>
      <Card>
        <CardHeader>
          <CardTitle>Add a new coin</CardTitle>
          <CardDescription>
            Fill in the details for the new cryptocurrency to list it on the exchange.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="coinName">Coin Name</Label>
              <Input
                id="coinName"
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
                placeholder="e.g. Bitcoin"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g. BTC"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="network">Network</Label>
              <Input
                id="network"
                value={network}
                onChange={(e) => setNetwork(e.target.value)}
                placeholder="e.g. Bitcoin, Ethereum, BEP20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contractAddress">Contract Address (optional)</Label>
              <Input
                id="contractAddress"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="e.g. 0x..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qrCode">QR Code Image</Label>
              <Input
                id="qrCode"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              <p className="text-sm text-gray-500 mt-1">Max file size: 1MB</p>
            </div>
            <Button type="submit">Add Currency</Button>
            {status && <p className="text-sm text-gray-500 mt-2">{status}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
