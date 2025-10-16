'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { collection, query, where, onSnapshot, getDocs, updateDoc, doc, getDoc, runTransaction } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LuInfo } from 'react-icons/lu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { TradeStatus } from '@/lib/trade-types';

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
    status: TradeStatus;
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
                    status: 'joined'
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
    
        const userDocRef = doc(db, 'users', currentUser.uid);
        const q = query(collection(db, "trades"), where("roomId", "==", roomid as string));
    
        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                throw new Error("Could not find the trade to update.");
            }
            const tradeDocRef = querySnapshot.docs[0].ref;
    
            await runTransaction(db, async (transaction) => {
                const tradeDoc = await transaction.get(tradeDocRef);
                const userDoc = await transaction.get(userDocRef);
    
                if (!tradeDoc.exists() || !userDoc.exists()) {
                    throw new Error("Required data not found.");
                }
    
                const tradeData = tradeDoc.data() as Trade;
                const userData = userDoc.data();
    
                const requiredTokenName = userRole === 'seller' ? tradeData.sellersToken.name : tradeData.buyersToken.name;
                const requiredAmount = userRole === 'seller' ? tradeData.sellerAmount : tradeData.buyerAmount;
                const currentBalance = userData.balances?.[requiredTokenName] ?? 0;
    
                if (currentBalance < requiredAmount) {
                    const missingAmount = requiredAmount - currentBalance;
                    router.push(`/dashboard/deposit?token=${requiredTokenName}&amount=${missingAmount}`);
                    throw new Error("Redirecting to deposit page.");
                }
    
                const newBalance = currentBalance - requiredAmount;
                transaction.update(userDocRef, { [`balances.${requiredTokenName}`]: newBalance });
    
                let newStatus: TradeStatus = tradeData.status;
                const updates: any = {};
    
                if (userRole === 'seller') {
                    updates.sellerPaymentStatus = 'paid';
                    if (tradeData.buyerPaymentStatus === 'paid') {
                        newStatus = 'ready_to_withdraw';
                    } else {
                        newStatus = 'seller_deposited';
                    }
                } else { // buyer
                    updates.buyerPaymentStatus = 'paid';
                    if (tradeData.sellerPaymentStatus === 'paid') {
                        newStatus = 'ready_to_withdraw';
                    } else {
                        newStatus = 'buyer_deposited';
                    }
                }
                updates.status = newStatus;
                transaction.update(tradeDocRef, updates);
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
        if (trade.status !== 'ready_to_withdraw') {
            setError("Both parties must deposit funds before withdrawal.");
            return;
        }

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
                if (tradeData.status !== 'ready_to_withdraw') {
                    throw new Error("Both parties must deposit funds before withdrawal.");
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

    const handleCancelTrade = async () => {
        if (!trade || !currentUser) {
            setError("Cannot cancel trade. User or trade data is missing.");
            return;
        }
    
        const q = query(collection(db, "trades"), where("roomId", "==", roomid as string));
    
        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                throw new Error("Could not find the trade to update.");
            }
            const tradeDocRef = querySnapshot.docs[0].ref;
    
            await runTransaction(db, async (transaction) => {
                const tradeDoc = await transaction.get(tradeDocRef);
                if (!tradeDoc.exists()) {
                    throw new Error("Trade document not found.");
                }
    
                const tradeData = tradeDoc.data() as Trade;
    
                if (tradeData.status === 'completed' || tradeData.status === 'cancelled') {
                    throw new Error("This trade is already finalized or cancelled.");
                }
    
                let sellerUid, buyerUid;
                if (tradeData.traderRole === 'seller') {
                    sellerUid = tradeData.creatorId;
                    buyerUid = tradeData.participantId;
                } else {
                    sellerUid = tradeData.participantId;
                    buyerUid = tradeData.creatorId;
                }
    
                if (tradeData.sellerPaymentStatus === 'paid' && sellerUid) {
                    const sellerUserRef = doc(db, 'users', sellerUid);
                    const sellerDoc = await transaction.get(sellerUserRef);
                    if (sellerDoc.exists()) {
                        const sellerData = sellerDoc.data();
                        const newBalance = (sellerData.balances?.[tradeData.sellersToken.name] ?? 0) + tradeData.sellerAmount;
                        transaction.update(sellerUserRef, { [`balances.${tradeData.sellersToken.name}`]: newBalance });
                    }
                }
    
                if (tradeData.buyerPaymentStatus === 'paid' && buyerUid) {
                    const buyerUserRef = doc(db, 'users', buyerUid);
                    const buyerDoc = await transaction.get(buyerUserRef);
                    if (buyerDoc.exists()) {
                        const buyerData = buyerDoc.data();
                        const newBalance = (buyerData.balances?.[tradeData.buyersToken.name] ?? 0) + tradeData.buyerAmount;
                        transaction.update(buyerUserRef, { [`balances.${tradeData.buyersToken.name}`]: newBalance });
                    }
                }
    
                transaction.update(tradeDocRef, { status: 'cancelled' });
            });
    
        } catch (error: any) {
            console.error("Cancellation failed: ", error);
            setError(`Cancellation failed: ${error.message}`);
        }
    };

    const getTradeProgress = (trade: Trade): { percentage: number; statusText: string } => {
        const progressMap: { [key in TradeStatus]: { percentage: number; statusText: string } } = {
            pending: { percentage: 15, statusText: "Trade Created" },
            joined: { percentage: 30, statusText: "Both Parties Joined" },
            buyer_deposited: { percentage: 60, statusText: "Buyer Has Deposited" },
            seller_deposited: { percentage: 60, statusText: "Seller Has Deposited" },
            ready_to_withdraw: { percentage: 80, statusText: "Ready for Withdrawal" },
            completed: { percentage: 100, statusText: "Trade Completed" },
            cancelled: { percentage: 0, statusText: "Trade Cancelled" },
        };
        return progressMap[trade.status] || { percentage: 0, statusText: 'Unknown Status' };
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
        !['joined', 'buyer_deposited', 'seller_deposited'].includes(trade.status);

    const isWithdrawDisabled = trade.status !== 'ready_to_withdraw';
    const isCancelDisabled = trade.status === 'completed' || trade.status === 'cancelled';

    const { percentage, statusText } = getTradeProgress(trade);

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Trade Room</CardTitle>
                    <CardDescription>Trade ID: {trade.roomId}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <div className="flex justify-between mb-1">
                            <span className="text-base font-medium text-blue-700">Trade Progress</span>
                            <span className="text-sm font-medium text-blue-700">{statusText}</span>
                        </div>
                        <Progress value={percentage} className={trade.status === 'cancelled' ? 'bg-red-400' : ''}/>
                    </div>
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
                                        <p className={`font-semibold ${trade.status === 'cancelled' ? 'text-red-500' : ''}`}>{trade.status}</p>
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
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" className="w-full" disabled={isCancelDisabled}>Cancel Trade</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently cancel the trade.
                                                            If any funds have been deposited, they will be returned to the respective parties.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Back</AlertDialogCancel>
                                                        <AlertDialogAction onClick={handleCancelTrade}>Yes, Cancel Trade</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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
