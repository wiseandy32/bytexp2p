'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc, getDoc, runTransaction } from 'firebase/firestore';
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
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (!roomid) return;

        const q = query(collection(db, "trades"), where("roomId", "==", roomid as string));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const tradeDoc = querySnapshot.docs[0];
                const tradeData = tradeDoc.data() as Trade;
                if (currentUser?.email === tradeData.sellerEmail || currentUser?.email === tradeData.buyerEmail) {
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
    }, [roomid, currentUser]);

    const userRole = trade && currentUser ? (currentUser.email === trade.sellerEmail ? 'seller' : currentUser.email === trade.buyerEmail ? 'buyer' : null) : null;

    const handleJoinTrade = async () => {
        if (!trade || !currentUser) return;

        const q = query(collection(db, "trades"), where("roomId", "==", roomid as string));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const tradeDocRef = querySnapshot.docs[0].ref;
            try {
                await updateDoc(tradeDocRef, {
                    participantId: currentUser.uid,
                    status: 'active'
                });
            } catch (err) {
                console.error("Error joining trade:", err);
                setError("Failed to join trade.");
            }
        }
    };

    const handleMakeDeposit = async () => {
        if (!trade || !currentUser || !userRole) {
            setError("Cannot process deposit. User or trade data is missing.");
            return;
        }

        const requiredTokenName = userRole === 'seller' ? trade.sellersToken.name : trade.buyersToken.name;
        const requiredAmount = userRole === 'seller' ? trade.sellerAmount : trade.buyerAmount;

        const userDocRef = doc(db, 'users', currentUser.uid);

        try {
            await runTransaction(db, async (transaction) => {
                const userDocSnap = await transaction.get(userDocRef);
                if (!userDocSnap.exists()) {
                    throw new Error("User document not found.");
                }

                const userData = userDocSnap.data();
                const currentBalance = userData.balances?.[requiredTokenName] ?? 0;

                if (currentBalance >= requiredAmount) {
                    const q = query(collection(db, "trades"), where("roomId", "==", roomid as string));
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.empty) {
                        throw new Error("Could not find the trade to update.");
                    }
                    const tradeDocRef = querySnapshot.docs[0].ref;

                    const newBalance = currentBalance - requiredAmount;
                    transaction.update(userDocRef, { [`balances.${requiredTokenName}`]: newBalance });

                    const statusFieldToUpdate = userRole === 'seller' ? 'sellerPaymentStatus' : 'buyerPaymentStatus';
                    transaction.update(tradeDocRef, { [statusFieldToUpdate]: 'paid' });
                } else {
                    const missingAmount = requiredAmount - currentBalance;
                    router.push(`/dashboard/deposit?token=${requiredTokenName}&amount=${missingAmount}`);
                    throw new Error("Redirecting to deposit page."); // Stop transaction
                }
            });
        } catch (error: any) {
            if (error.message !== "Redirecting to deposit page.") {
                console.error("Deposit processing failed: ", error);
                setError(`Failed to process deposit: ${error.message}`);
            }
        }
    };

    const handleWithdrawToken = async () => {
        if (!trade || !currentUser) return;

        let sellerUid, buyerUid;
        if (trade.traderRole === 'seller') {
            sellerUid = trade.creatorId;
            buyerUid = trade.participantId;
        } else {
            sellerUid = trade.participantId;
            buyerUid = trade.creatorId;
        }

        if (!sellerUid || !buyerUid) {
            setError("Cannot process withdrawal. Counterparty has not joined or is missing.");
            return;
        }

        const sellerUserRef = doc(db, 'users', sellerUid);
        const buyerUserRef = doc(db, 'users', buyerUid);
        const q = query(collection(db, "trades"), where("roomId", "==", roomid as string));
        
        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                setError("Could not find the trade to update.");
                return;
            }
            const tradeDocRef = querySnapshot.docs[0].ref;

            await runTransaction(db, async (transaction) => {
                const tradeDoc = await transaction.get(tradeDocRef);
                const sellerDoc = await transaction.get(sellerUserRef);
                const buyerDoc = await transaction.get(buyerUserRef);

                if (!tradeDoc.exists() || !sellerDoc.exists() || !buyerDoc.exists()) {
                    throw new Error("A required document (trade, seller, or buyer) is missing.");
                }

                const tradeData = tradeDoc.data() as Trade;
                if (tradeData.sellerPaymentStatus !== 'paid' || tradeData.buyerPaymentStatus !== 'paid') {
                    throw new Error("Both parties must deposit funds before withdrawal.");
                }
                if (tradeData.status === 'completed') {
                    throw new Error("Withdrawal has already been processed.");
                }

                const sellerData = sellerDoc.data();
                const buyerData = buyerDoc.data();

                const sellerReceivesToken = tradeData.buyersToken.name;
                const sellerReceivesAmount = tradeData.buyerAmount;
                const newSellerBalance = (sellerData.balances?.[sellerReceivesToken] ?? 0) + sellerReceivesAmount;

                const buyerReceivesToken = tradeData.sellersToken.name;
                const buyerReceivesAmount = tradeData.sellerAmount;
                const newBuyerBalance = (buyerData.balances?.[buyerReceivesToken] ?? 0) + buyerReceivesAmount;

                transaction.update(sellerUserRef, { [`balances.${sellerReceivesToken}`]: newSellerBalance });
                transaction.update(buyerUserRef, { [`balances.${buyerReceivesToken}`]: newBuyerBalance });
                transaction.update(tradeDocRef, { status: 'completed' });
            });
        } catch (error: any) {
            console.error("Withdrawal failed: ", error);
            setError(`Withdrawal failed: ${error.message}`);
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

    const isDepositDisabled =
        (userRole === 'seller' && trade.sellerPaymentStatus === 'paid') ||
        (userRole === 'buyer' && trade.buyerPaymentStatus === 'paid') ||
        trade.status === 'completed';

    const isWithdrawDisabled = trade.sellerPaymentStatus !== 'paid' || trade.buyerPaymentStatus !== 'paid' || trade.status === 'completed';

    const isCancelDisabled = trade.status === 'completed';

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
                                            <Button className="w-full" disabled={isDepositDisabled} onClick={handleMakeDeposit}>Make Deposit</Button>
                                            <Button variant="outline" className="w-full" disabled={isWithdrawDisabled} onClick={handleWithdrawToken}>Withdraw Token</Button>
                                            <Button variant="destructive" className="w-full" disabled={isCancelDisabled}>Cancel Trade</Button>
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
