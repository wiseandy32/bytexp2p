'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface Cryptocurrency {
  name: string;
  shortName: string;
  logoUrl: string;
  depositAddress: string;
}

export default function EditCryptocurrencyForm({ cryptocurrencyId }: { cryptocurrencyId: string }) {
  const [cryptocurrency, setCryptocurrency] = useState<Cryptocurrency | null>(null);
  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
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
      }
    };
    fetchCryptocurrency();
  }, [cryptocurrencyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, 'cryptocurrencies', cryptocurrencyId);
      await updateDoc(docRef, {
        name,
        shortName,
        logoUrl,
        depositAddress,
      });
      router.push('/admin/cryptocurrencies');
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  if (!cryptocurrency) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
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
        <label htmlFor="logoUrl" className="block text-gray-700 dark:text-gray-300">Logo URL</label>
        <input
          type="text"
          id="logoUrl"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
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
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Update Cryptocurrency
      </button>
    </form>
  );
}
