'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import { collection, query, where, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

interface Trade {
    id: string;
    roomId: string;
    status: string;
    sellerEmail: string;
    buyerEmail: string;
    sellerAmount: number;
    sellersToken: { name: string };
    buyerAmount: number;
    buyersToken: { name: string };
    createdAt: any;
}

export default function MyExchangesPage() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [trades, setTrades] = useState<Map<string, Trade>>(new Map());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(user => {
            if (user) {
                setUserEmail(user.email);
            } else {
                setTrades(new Map());
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!userEmail) return;

        setLoading(true);
        const tradesRef = collection(db, 'trades');

        const handleSnapshot = (snapshot: QuerySnapshot) => {
            setTrades(prevTrades => {
                const newTrades = new Map(prevTrades);
                snapshot.docChanges().forEach(change => {
                    const doc = change.doc;
                    if (change.type === 'removed') {
                        newTrades.delete(doc.id);
                    } else {
                        newTrades.set(doc.id, { ...doc.data(), id: doc.id } as Trade);
                    }
                });
                return newTrades;
            });
            setLoading(false);
        };

        const handleError = (err: any) => {
            console.error("Error fetching trades:", err);
            setError("Failed to fetch your trades.");
            setLoading(false);
        };

        const sellerQuery = query(tradesRef, where("sellerEmail", "==", userEmail));
        const unsubscribeSeller = onSnapshot(sellerQuery, handleSnapshot, handleError);

        const buyerQuery = query(tradesRef, where("buyerEmail", "==", userEmail));
        const unsubscribeBuyer = onSnapshot(buyerQuery, handleSnapshot, handleError);

        return () => {
            unsubscribeSeller();
            unsubscribeBuyer();
        };
    }, [userEmail]);

    const allTrades = useMemo(() => {
        return Array.from(trades.values()).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    }, [trades]);

    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
            case 'joined':
                return 'bg-blue-200 text-blue-800';
            case 'seller_deposited':
            case 'buyer_deposited':
            case 'ready_to_withdraw':
                return 'bg-yellow-200 text-yellow-800';
            case 'completed':
                return 'bg-green-200 text-green-800';
            case 'cancelled':
                return 'bg-red-200 text-red-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    if (loading) {
        return <div className="text-center my-4">Loading your exchanges...</div>;
    }

    if (error) {
        return <div className="text-center my-4 text-red-500">{error}</div>;
    }

    if (!userEmail) {
        return <div className="text-center my-4">Please log in to see your exchanges.</div>;
    }

    return (
        <div className="w-full max-w-6xl mx-auto">
            <div className="text-center my-4">
                <h1 className="text-2xl font-bold">My Exchanges</h1>
                <p className="text-gray-500">Here are your ongoing and past exchanges. Tap a card to open it.</p>
            </div>

            {allTrades.length === 0 ? (
                <p className="text-center text-gray-500">You have no exchanges.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allTrades.map((trade) => {
                        const userRole = userEmail === trade.sellerEmail ? 'seller' : 'buyer';
                        const sendAmount = userRole === 'seller' ? `${trade.sellerAmount} ${trade.sellersToken.name}` : `${trade.buyerAmount} ${trade.buyersToken.name}`;
                        const receiveAmount = userRole === 'seller' ? `${trade.buyerAmount} ${trade.buyersToken.name}` : `${trade.sellerAmount} ${trade.sellersToken.name}`;

                        return (
                            <Link href={`/dashboard/view-room/${trade.roomId}`} key={trade.roomId}>
                                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center border-b pb-2 mb-3">
                                            <p className="text-sm">
                                                Status: <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(trade.status)}`}>
                                                    {trade.status.replace(/_/g, ' ')}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500">Room ID</p>
                                                <p className="text-sm font-mono">{trade.roomId}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500">Your Role</p>
                                                <p className="text-sm font-bold capitalize">{userRole}</p>
                                            </div>
                                            <div className="mt-2">
                                                <p className="text-xs font-semibold text-gray-500">You Send</p>
                                                <p className="text-sm font-bold">{sendAmount}</p>
                                            </div>
                                            <div className="mt-2">
                                                <p className="text-xs font-semibold text-gray-500">You Receive</p>
                                                <p className="text-sm font-bold">{receiveAmount}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
