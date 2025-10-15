'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from 'react';
import Link from 'next/link';

export default function AdminOverview() {
  const [transactions, setTransactions] = useState([
    { id: 'txn_123', user: 'John Doe', date: '2023-04-01', amount: '$100.00', status: 'Completed' },
    { id: 'txn_456', user: 'Jane Smith', date: '2023-04-02', amount: '$250.50', status: 'Pending' },
    { id: 'txn_789', user: 'Sam Wilson', date: '2023-04-03', amount: '$50.00', status: 'Failed' },
    { id: 'txn_101', user: 'Alice Johnson', date: '2023-04-04', amount: '$300.00', status: 'Completed' },
    { id: 'txn_112', user: 'Bob Brown', date: '2023-04-05', amount: '$150.75', status: 'Completed' },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5,678</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$1,234,567</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Link href="/admin/transactions" className="text-sm font-medium text-blue-500 hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="pb-4">Transaction ID</th>
                <th className="pb-4">User</th>
                <th className="pb-4">Date</th>
                <th className="pb-4">Amount</th>
                <th className="pb-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map((txn) => (
                <tr key={txn.id} className="border-t border-gray-200 dark:border-gray-600">
                  <td className="py-4">{txn.id}</td>
                  <td className="py-4">{txn.user}</td>
                  <td className="py-4">{txn.date}</td>
                  <td className="py-4">{txn.amount}</td>
                  <td className="py-4">{txn.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
