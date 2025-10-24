'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Transaction {
    id: string;
    userId: string;
    amount: number;
    status: string;
    createdAt: {
        toDate: () => Date;
    };
    type: string;
}

export default function AdminOverview() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [totalVolume, setTotalVolume] = useState(0);
    const [pendingApprovals, setPendingApprovals] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
            setTotalUsers(snapshot.size);
        });

        const unsubscribeTransactions = onSnapshot(collection(db, 'transactions'), (snapshot) => {
            let volume = 0;
            let pending = 0;
            const txns: Transaction[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.type === 'deposit' && data.status === 'approved') {
                    volume += data.amount;
                }
                if (data.status === 'pending') {
                    pending++;
                }
                txns.push({ id: doc.id, ...data } as Transaction);
            });
            
            setTotalTransactions(snapshot.size);
            setTotalVolume(volume);
            setPendingApprovals(pending);

            txns.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime());
            setTransactions(txns.slice(0, 5));
        });

        return () => {
            unsubscribeUsers();
            unsubscribeTransactions();
        };
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalUsers}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{totalTransactions}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Deposits</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">${totalVolume.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Pending Approvals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{pendingApprovals}</p>
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
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="border-t border-gray-200 dark:border-gray-600">
                                    <td className="py-4">{txn.id}</td>
                                    <td className="py-4">{txn.userId}</td>
                                    <td className="py-4">{txn.createdAt.toDate().toLocaleDateString()}</td>
                                    <td className="py-4">${txn.amount.toFixed(2)}</td>
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