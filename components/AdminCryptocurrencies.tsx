'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Cryptocurrency {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  depositAddress: string;
}

export default function AdminCryptocurrencies() {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'cryptocurrencies'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cryptoData: Cryptocurrency[] = [];
      snapshot.forEach((doc) => {
        cryptoData.push({ id: doc.id, ...doc.data() } as Cryptocurrency);
      });
      setCryptocurrencies(cryptoData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">All Cryptocurrencies</h2>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400">
              <th className="pb-4">S/N</th>
              <th className="pb-4">Logo</th>
              <th className="pb-4">Name</th>
              <th className="pb-4">Symbol</th>
              <th className="pb-4">Deposit Address</th>
            </tr>
          </thead>
          <tbody>
            {cryptocurrencies.map((crypto, index) => (
              <tr
                key={crypto.id}
                className="border-t border-gray-200 dark:border-gray-600"
              >
                <td className="py-4">{index + 1}</td>
                <td className="py-4">
                  <img src={crypto.logoUrl} alt={crypto.name} className="w-8 h-8 rounded-full" />
                </td>
                <td className="py-4">{crypto.name}</td>
                <td className="py-4">{crypto.shortName}</td>
                <td className="py-4">{crypto.depositAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
