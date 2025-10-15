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
import { db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function AdminAddCryptocurrency() {
  const [cryptocurrencyName, setCryptocurrencyName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [network, setNetwork] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [qrCodeType, setQrCodeType] = useState<'url' | 'file'>('url');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoType, setLogoType] = useState<'url' | 'file'>('url');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleQrCodeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        setError('QR Code file size cannot exceed 1MB.');
        setQrCodeFile(null);
      } else {
        setError('');
        setQrCodeFile(file);
        setQrCodeUrl(''); // Clear URL input
      }
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        setError('Logo file size cannot exceed 1MB.');
        setLogoFile(null);
      } else {
        setError('');
        setLogoFile(file);
        setLogoUrl(''); // Clear URL input
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
    try {
      let finalQrCodeUrl = '';
      if (qrCodeType === 'file' && qrCodeFile) {
        finalQrCodeUrl = await uploadToCloudinary(qrCodeFile);
      } else if (qrCodeType === 'url') {
        finalQrCodeUrl = qrCodeUrl;
      }

      let finalLogoUrl = '';
      if (logoType === 'file' && logoFile) {
        finalLogoUrl = await uploadToCloudinary(logoFile);
      } else if (logoType === 'url') {
        finalLogoUrl = logoUrl;
      }

      await addDoc(collection(db, 'cryptocurrencies'), {
        name: cryptocurrencyName,
        symbol,
        network,
        depositAddress,
        qrCodeUrl: finalQrCodeUrl,
        logoUrl: finalLogoUrl,
      });

      setStatus('Cryptocurrency added successfully!');
      setCryptocurrencyName('');
      setSymbol('');
      setNetwork('');
      setDepositAddress('');
      setQrCodeFile(null);
      setQrCodeUrl('');
      setQrCodeType('url');
      setLogoFile(null);
      setLogoUrl('');
      setLogoType('url');
      setError('');
      // Reset file inputs
      const qrCodeFileInput = document.getElementById('qrCodeFileInput') as HTMLInputElement;
      if (qrCodeFileInput) {
        qrCodeFileInput.value = '';
      }
      const logoFileInput = document.getElementById('logoFileInput') as HTMLInputElement;
      if (logoFileInput) {
        logoFileInput.value = '';
      }
    } catch (e) {
      setError('Error adding cryptocurrency. Please try again.');
      setStatus('');
      console.error(e);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Add New Cryptocurrency</h2>
      <Card>
        <CardHeader>
          <CardTitle>Add a new cryptocurrency</CardTitle>
          <CardDescription>
            Fill in the details for the new cryptocurrency to list it on the exchange.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cryptocurrencyName">Cryptocurrency Name</Label>
              <Input
                id="cryptocurrencyName"
                value={cryptocurrencyName}
                onChange={(e) => setCryptocurrencyName(e.target.value)}
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
              <Label>Logo</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="logoUrlRadio"
                    name="logoType"
                    value="url"
                    checked={logoType === 'url'}
                    onChange={() => {
                      setLogoType('url');
                      setLogoFile(null);
                    }}
                  />
                  <Label htmlFor="logoUrlRadio">URL</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="logoFileRadio"
                    name="logoType"
                    value="file"
                    checked={logoType === 'file'}
                    onChange={() => {
                      setLogoType('file');
                      setLogoUrl('');
                    }}
                  />
                  <Label htmlFor="logoFileRadio">File</Label>
                </div>
              </div>
              {logoType === 'url' ? (
                <Input
                  id="logoUrlInput"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              ) : (
                <Input
                  id="logoFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                />
              )}
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
              <Label htmlFor="depositAddress">Deposit Address</Label>
              <Input
                id="depositAddress"
                value={depositAddress}
                onChange={(e) => setDepositAddress(e.target.value)}
                placeholder="e.g. 0x..."
              />
            </div>
            <div className="space-y-2">
              <Label>QR Code</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="qrCodeUrlRadio"
                    name="qrCodeType"
                    value="url"
                    checked={qrCodeType === 'url'}
                    onChange={() => {
                      setQrCodeType('url');
                      setQrCodeFile(null);
                    }}
                  />
                  <Label htmlFor="qrCodeUrlRadio">URL</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="qrCodeFileRadio"
                    name="qrCodeType"
                    value="file"
                    checked={qrCodeType === 'file'}
                    onChange={() => {
                      setQrCodeType('file');
                      setQrCodeUrl('');
                    }}
                  />
                  <Label htmlFor="qrCodeFileRadio">File</Label>
                </div>
              </div>
              {qrCodeType === 'url' ? (
                <Input
                  id="qrCodeUrlInput"
                  value={qrCodeUrl}
                  onChange={(e) => setQrCodeUrl(e.target.value)}
                  placeholder="https://example.com/qrcode.png"
                />
              ) : (
                <Input
                  id="qrCodeFileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleQrCodeFileChange}
                />
              )}
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
              <p className="text-sm text-gray-500 mt-1">Max file size: 1MB</p>
            </div>
            <Button type="submit">Add Cryptocurrency</Button>
            {status && <p className="text-sm text-gray-500 mt-2">{status}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
