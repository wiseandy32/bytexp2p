'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: {
    toDate: () => Date;
  };
  type: string;
  token: {
    shortName: string;
  };
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'transactions'), where('status', 'in', ['awaiting_approval', 'approved']));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData: Transaction[] = [];
      snapshot.forEach((doc) => {
        transactionsData.push({ id: doc.id, ...doc.data() } as Transaction);
      });
      setTransactions(transactionsData);
    });
    return () => unsubscribe();
  }, []);

  const handleRowClick = (transactionId: string) => {
    router.push(`/admin/transactions/${transactionId}`);
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'awaiting_payment':
        return "bg-amber-100 text-amber-800";
      case 'awaiting_approval':
        return "bg-blue-100 text-blue-800";
      case 'approved':
        return "bg-green-100 text-green-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Transactions</h2>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400">
              <th className="pb-4">Transaction ID</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr
                key={txn.id}
                onClick={() => handleRowClick(txn.id)}
                className="border-t border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="py-4">{txn.id}</td>
                <td className="py-4">{txn.createdAt.toDate().toLocaleDateString()}</td>
                <td className="py-4">{txn.amount} {txn.token.shortName}</td>
                <td className="py-4">
                  <Badge className={getStatusClasses(txn.status)}>
                    {txn.status}
                  </Badge>
                </td>
                <td className="py-4">{txn.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
