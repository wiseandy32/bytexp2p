'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="px-6 py-3 whitespace-nowrap">S/N</th>
                <th className="px-6 py-3 whitespace-nowrap">Logo</th>
                <th className="px-6 py-3 whitespace-nowrap">Name</th>
                <th className="px-6 py-3 whitespace-nowrap">Symbol</th>
                <th className="px-6 py-3 whitespace-nowrap">Deposit Address</th>
                <th className="px-6 py-3 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {cryptocurrencies.map((crypto, index) => (
                <tr
                  key={crypto.id}
                  className="border-t border-gray-200 dark:border-gray-600"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={crypto.logoUrl} alt={crypto.name} className="w-8 h-8 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{crypto.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{crypto.shortName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{crypto.depositAddress}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/admin/cryptocurrencies/edit/${crypto.id}`} className="text-blue-500 hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
