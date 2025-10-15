'use client';

import { useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([
    { id: 'txn_123', user: 'John Doe', date: '2023-04-01', amount: '$100.00', status: 'Completed', type: 'Deposit' },
    { id: 'txn_456', user: 'Jane Smith', date: '2023-04-02', amount: '$250.50', status: 'Pending', type: 'Withdrawal' },
    { id: 'txn_789', user: 'Sam Wilson', date: '2023-04-03', amount: '$50.00', status: 'Failed', type: 'Trade' },
  ]);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const handleAction = (transactionId: string, action: string) => {
    // Implement the logic for handling actions like 'approve', 'reject', or 'view'
    console.log(`Performing ${action} on transaction ${transactionId}`);
    setOpenActionMenu(null); // Close the menu after action
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Transactions</h2>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400">
              <th className="pb-4">Transaction ID</th>
              <th className="pb-4">User</th>
              <th className="pb-4">Date</th>
              <th className="pb-4">Amount</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Type</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id} className="border-t border-gray-200 dark:border-gray-600">
                <td className="py-4">{txn.id}</td>
                <td className="py-4">{txn.user}</td>
                <td className="py-4">{txn.date}</td>
                <td className="py-4">{txn.amount}</td>
                <td className="py-4">{txn.status}</td>
                <td className="py-4">{txn.type}</td>
                <td className="py-4 relative">
                  <button onClick={() => setOpenActionMenu(openActionMenu === txn.id ? null : txn.id)} className="text-gray-500 hover:text-gray-700">
                    <FiMoreVertical size={20} />
                  </button>
                  {openActionMenu === txn.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                      <button onClick={() => handleAction(txn.id, 'approve')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">Approve</button>
                      <button onClick={() => handleAction(txn.id, 'reject')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">Reject</button>
                      <button onClick={() => handleAction(txn.id, 'view')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">View</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
