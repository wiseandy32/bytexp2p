'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { collection, query, where, onSnapshot, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LuInfo } from 'react-icons/lu';

interface Trade {
    creatorId: string;
    traderRole: string;
    sellerAmount: number;
    buyerAmount: number;
    sellerEmail: string;
    buyerEmail: string;
    feeSplit: string;
    sellersToken: { name: string; image: string };
    buyersToken: { name: string; image: string };
    status: string;
    roomId: string;
    participantId?: string;
    buyerPaymentStatus: string;
    sellerPaymentStatus: string;
}

export default function ViewRoomPage() {
    const router = useRouter();
    const params = useParams();
    const { roomid } = params;
    const [trade, setTrade] = useState<Trade | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!roomid) return;

        const q = query(collection(db, "trades"), where("roomId", "==", roomid as string));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const tradeDoc = querySnapshot.docs[0];
                const tradeData = tradeDoc.data() as Trade;
                if (auth.currentUser?.email === tradeData.sellerEmail || auth.currentUser?.email === tradeData.buyerEmail) {
                    setTrade(tradeData);
                } else {
                    setError("You are not authorized to view this trade.");
                }
            } else {
                setError("Trade not found.");
            }
            setLoading(false);
        }, (err) => {
            console.error("Error fetching trade:", err);
            setError("Failed to fetch trade details.");
            setLoading(false);
        });

        return () => unsubscribe();
    }, [roomid]);

    const handleJoinTrade = async () => {
        if (!trade || !auth.currentUser) return;

        const q = query(collection(db, "trades"), where("roomId", "==", roomid as string));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const tradeDocRef = querySnapshot.docs[0].ref;
            try {
                await updateDoc(tradeDocRef, {
                    participantId: auth.currentUser.uid,
                    status: 'active'
                });
            } catch (err) {
                console.error("Error joining trade:", err);
                setError("Failed to join trade.");
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!trade) {
        return <div className="flex justify-center items-center h-screen">Trade details not available.</div>;
    }

    const currentUser = auth.currentUser;
    const userRole = currentUser?.email === trade.sellerEmail ? 'seller' : currentUser?.email === trade.buyerEmail ? 'buyer' : null;

    const isDepositDisabled =
        (userRole === 'seller' && trade.sellerPaymentStatus === 'paid') ||
        (userRole === 'buyer' && trade.buyerPaymentStatus === 'paid');

    const isWithdrawDisabled = trade.sellerPaymentStatus !== 'paid' || trade.buyerPaymentStatus !== 'paid';

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Trade Room</CardTitle>
                    <CardDescription>Trade ID: {trade.roomId}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column: Trade Info */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Trade Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between">
                                        <p className="text-gray-500">Trade Status</p>
                                        <p>{trade.status}</p>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex justify-between">
                                            <p className="text-gray-500">Your Role</p>
                                            <p>{userRole}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <p className="text-gray-500">Fee Payer</p>
                                            <p>{trade.feeSplit}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="mt-3 mb-3">
                                <CardHeader>
                                    <CardTitle><h5><u>Seller's Details</u></h5></CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <hr />
                
                                    <div className="flex justify-between">
                                        <p className="text-gray-500">Seller's ID</p>
                                        <p>{trade.sellerEmail}</p>
                                    </div>
                
                                    <div className="flex justify-between">
                                        <p className="text-gray-500">Sending</p>
                                        <p>{trade.sellerAmount} {trade.sellersToken.name}</p>
                                    </div>
                
                                    <div className="flex justify-between">
                                        <p className="text-gray-500">Receiving</p>
                                        <p>{trade.buyerAmount} {trade.buyersToken.name}</p>
                                    </div>
                
                                    <div className="flex justify-between">
                                        <p className="text-gray-500">Payment Status</p>
                                        <p><span className={`badge ${trade.sellerPaymentStatus === 'paid' ? 'badge-success text-white' : 'badge-warning text-white'}`}>{trade.sellerPaymentStatus === 'paid' ? 'Paid' : 'Pending'}</span></p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="mt-3">
                                <CardHeader>
                                    <CardTitle><h5><u>Buyer's Details</u></h5></CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <hr />
                
                                    <div className="flex justify-between">
                                        <p className="text-gray-500">Buyer's ID</p>
                                        <p>{trade.buyerEmail ? trade.buyerEmail : <span className="text-yellow-500">Waiting to join...</span>}</p>
                                    </div>
                
                                    <div className="flex justify-between">
                                        <p className="text-gray-500">Sending</p>
                                        <p>{trade.buyerAmount} {trade.buyersToken.name}</p>
                                    </div>
                
                                    <div className="flex justify-between">
                                        <p className="text-gray-500">Receiving</p>
                                        <p>{trade.sellerAmount} {trade.sellersToken.name}</p>
                                    </div>
                
                                    <div className="flex justify-between">
                                        <p className="text-gray-500">Payment Status</p>
                                        <p><span className={`badge ${trade.buyerPaymentStatus === 'paid' ? 'badge-success text-white' : 'badge-warning text-white'}`}>{trade.buyerPaymentStatus === 'paid' ? 'Paid' : 'Pending'}</span></p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Actions */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {trade.status === 'pending' ? (
                                        currentUser?.uid !== trade.creatorId ? (
                                            <Button className="w-full" onClick={handleJoinTrade}>Join Trade</Button>
                                        ) : (
                                            <p className="text-gray-500 text-center">Waiting for counterparty...</p>
                                        )
                                    ) : (
                                        <>
                                            <Button className="w-full" disabled={isDepositDisabled}>Make Deposit</Button>
                                            <Button variant="outline" className="w-full" disabled={isWithdrawDisabled}>Withdraw Token</Button>
                                            <Button variant="destructive" className="w-full">Cancel Trade</Button>
                                            <div className="text-sm text-gray-500 p-4 bg-gray-100 rounded-md">
                                                <div className="flex items-start">
                                                    <LuInfo className="mr-2 mt-1 h-4 w-4"/>
                                                    <span>Only cancel the trade if you are certain. This action cannot be undone.</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
