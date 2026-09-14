'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';

interface Cryptocurrency {
  name: string;
  shortName: string;
  logoUrl: string;
  depositAddress: string;
  network: string;
  qrCodeUrl: string;
}

export default function EditCryptocurrencyForm({ cryptocurrencyId }: { cryptocurrencyId: string }) {
  const [cryptocurrency, setCryptocurrency] = useState<Cryptocurrency | null>(null);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [logoType, setLogoType] = useState('url');
  const [qrCodeType, setQrCodeType] = useState('url');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCryptocurrency = async () => {
      const docRef = doc(db, 'cryptocurrencies', cryptocurrencyId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Cryptocurrency;
        setCryptocurrency(data);
        setName(data.name);
        setShortName(data.shortName);
        setLogoUrl(data.logoUrl);
        setDepositAddress(data.depositAddress);
        setNetwork(data.network);
        setQrCodeUrl(data.qrCodeUrl);
      }
    };
    fetchCryptocurrency();
  }, [cryptocurrencyId]);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('Logo file size cannot exceed 2MB.');
        setLogoFile(null);
        e.target.value = '';
        return;
      }
      setError('');
      setLogoFile(file);
    }
  };

  const handleQrCodeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('QR Code file size cannot exceed 2MB.');
        setQrCodeFile(null);
        e.target.value = '';
        return;
      }
      setError('');
      setQrCodeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error) {
      toast.error('Please fix the errors before submitting.');
      return;
    }
    const idToken = await auth.currentUser?.getIdToken();
    if (!idToken) {
      toast.error('Session expired. Please log in again.');
      return;
    }
    setIsSubmitting(true);
    try {
      let finalLogoUrl = logoUrl;
      if (logoFile) {
        const formData = new FormData();
        formData.append('file', logoFile);
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          finalLogoUrl = data.url;
        } else {
          console.error('Error uploading file:', data.error);
          toast.error('Error uploading logo file');
          setIsSubmitting(false);
          return;
        }
      }

      let finalQrCodeUrl = qrCodeUrl;
      if (qrCodeFile) {
        const formData = new FormData();
        formData.append('file', qrCodeFile);
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          finalQrCodeUrl = data.url;
        } else {
          console.error('Error uploading file:', data.error);
          toast.error('Error uploading QR code file');
          setIsSubmitting(false);
          return;
        }
      }

      const docRef = doc(db, 'cryptocurrencies', cryptocurrencyId);
      await updateDoc(docRef, {
        name,
        shortName,
        logoUrl: finalLogoUrl,
        depositAddress,
        network,
        qrCodeUrl: finalQrCodeUrl,
      });
      toast.success('Cryptocurrency updated successfully!');
      router.push('/admin/cryptocurrencies');
    } catch (error) {
      console.error('Error updating document: ', error);
      toast.error('Error updating cryptocurrency');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!cryptocurrency) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
      <Toaster richColors />
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 dark:text-gray-300">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-800 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="shortName" className="block text-gray-700 dark:text-gray-300">Symbol</label>
        <input
          type="text"
          id="shortName"
          value={shortName}
          onChange={(e) => setShortName(e.target.value)}
          className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-800 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300">Logo</label>
        <div className="flex items-center space-x-4 mt-2">
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
            <label htmlFor="logoUrlRadio">URL</label>
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
            <label htmlFor="logoFileRadio">File</label>
          </div>
        </div>
        {logoType === 'url' ? (
          <input
            id="logoUrlInput"
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-800 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        ) : (
          <input
            id="logoFileInput"
            type="file"
            accept="image/*"
            onChange={handleLogoFileChange}
            className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-800 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="network" className="block text-gray-700 dark:text-gray-300">Network</label>
        <input
          type="text"
          id="network"
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
          className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-800 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="depositAddress" className="block text-gray-700 dark:text-gray-300">Deposit Address</label>
        <input
          type="text"
          id="depositAddress"
          value={depositAddress}
          onChange={(e) => setDepositAddress(e.target.value)}
          className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-800 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300">QR Code</label>
        <div className="flex items-center space-x-4 mt-2">
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
            <label htmlFor="qrCodeUrlRadio">URL</label>
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
            <label htmlFor="qrCodeFileRadio">File</label>
          </div>
        </div>
        {qrCodeType === 'url' ? (
          <input
            id="qrCodeUrlInput"
            type="text"
            value={qrCodeUrl}
            onChange={(e) => setQrCodeUrl(e.target.value)}
            placeholder="https://example.com/qrcode.png"
            className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-800 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        ) : (
          <input
            id="qrCodeFileInput"
            type="file"
            accept="image/*"
            onChange={handleQrCodeFileChange}
            className="w-full px-4 py-2 mt-2 bg-gray-200 dark:bg-gray-800 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      )}
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 disabled:bg-gray-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Updating...' : 'Update Cryptocurrency'}
      </button>
    </form>
  );
}
