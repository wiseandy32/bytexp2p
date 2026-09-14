'use client';
import { useEffect, useState, ReactNode } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LuArrowLeftRight, LuChevronDown, LuArrowUpDown } from 'react-icons/lu';
import TokenModal from '@/components/TokenModal';
import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Token } from '@/lib/data';
import { TradeStatus } from '@/lib/trade-types';
import { toast } from 'sonner';

function generateRoomId(length: number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

interface SelectedToken {
    name: string;
    image: string;
}

export default function CreateTradePage() {
    const router = useRouter();
    const [traderRole, setTraderRole] = useState('seller');
    const [sellerAmount, setSellerAmount] = useState('');
    const [buyerAmount, setBuyerAmount] = useState('');
    const [sellerEmail, setSellerEmail] = useState('');
    const [buyerEmail, setBuyerEmail] = useState('');
    const [feeSplit, setFeeSplit] = useState('equal');
    const [sellersToken, setSellersToken] = useState<SelectedToken | null>(null);
    const [buyersToken, setBuyersToken] = useState<SelectedToken | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTokenSide, setCurrentTokenSide] = useState('1');
    const [error, setError] = useState<ReactNode | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user?.email) {
                if (traderRole === 'seller') {
                    setSellerEmail(user.email);
                    setBuyerEmail((prev) => prev === user.email ? '' : prev);
                } else {
                    setBuyerEmail(user.email);
                    setSellerEmail((prev) => prev === user.email ? '' : prev);
                }
            }
        });
        return () => unsubscribe();
    }, [traderRole]);

    const handleTokenSelect = (token: Token) => {
        const selectedToken = { name: token.shortName, image: token.logoUrl };
        if (currentTokenSide === '1') {
            setSellersToken(selectedToken);
        } else {
            setBuyersToken(selectedToken);
        }
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsCreating(true);

        if (!auth.currentUser || !sellersToken || !buyersToken) {
            setError('Please select both tokens.');
            setIsCreating(false);
            return;
        }

        if (auth.currentUser.email !== sellerEmail && auth.currentUser.email !== buyerEmail) {
            setError("Your email must match either the seller's or the buyer's email.");
            setIsCreating(false);
            return;
        }

        // Counterparty sanity checks: no self-trades, positive amounts,
        // and two different tokens.
        if (sellerEmail.trim().toLowerCase() === buyerEmail.trim().toLowerCase()) {
            setError('Seller and buyer emails must be different.');
            setIsCreating(false);
            return;
        }

        const parsedSellerAmount = parseFloat(sellerAmount);
        const parsedBuyerAmount = parseFloat(buyerAmount);
        if (
            isNaN(parsedSellerAmount) || isNaN(parsedBuyerAmount) ||
            parsedSellerAmount <= 0 || parsedBuyerAmount <= 0
        ) {
            setError('Both trade amounts must be numbers greater than zero.');
            setIsCreating(false);
            return;
        }

        if (sellersToken?.name === buyersToken?.name) {
            setError('Seller and buyer tokens must be different.');
            setIsCreating(false);
            return;
        }

        const roomId = generateRoomId(6);
        const initialStatus: TradeStatus = 'pending';

        try {
            await addDoc(collection(db, 'trades'), {
                creatorId: auth.currentUser.uid,
                traderRole,
                sellerAmount: parseFloat(sellerAmount),
                buyerAmount: parseFloat(buyerAmount),
                sellerEmail,
                buyerEmail,
                feeSplit,
                sellersToken,
                buyersToken,
                status: initialStatus,
                buyerPaymentStatus: 'pending',
                sellerPaymentStatus: 'pending',
                createdAt: serverTimestamp(),
                roomId,
            });

            // Send trade creation emails (content derived server-side
            // from the stored trade; only the room id is sent, with auth).
            const tradeLink = `${window.location.origin}/dashboard/view-room/${roomId}`;

            try {
                const idToken = await auth.currentUser?.getIdToken();
                if (!idToken) throw new Error("Session expired. Please log in again.");
                const emailRes = await fetch('/api/send-trade-creation-emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${idToken}`,
                    },
                    body: JSON.stringify({ roomId, tradeLink }),
                });
                if (!emailRes.ok) {
                    console.error("Trade creation emails failed: ", await emailRes.text());
                    toast.warning('Trade created, but the invite emails could not be sent. Please share the room ID with your counterparty manually.');
                } else {
                    const emailData = await emailRes.json();
                    const counterparty = traderRole === 'seller' ? buyerEmail : sellerEmail;
                    if (emailData.participantEmailSent === false) {
                        const reason = emailData.inviteSkippedReason === 'recipient_limit'
                            ? `${counterparty} has already received several invites recently, so this one was skipped to avoid spamming them.`
                            : `invite sending is temporarily limited for your account.`;
                        toast.warning(`Trade created, but no invite was sent to ${counterparty} (${reason}) Share room ID ${roomId} with them manually so they can join.`, { duration: 10000 });
                    } else if (emailData.inviteSentToUnregistered) {
                        toast.success(`Trade created. ${counterparty} isn't registered yet, so we sent an invite with signup instructions — or share room ID ${roomId} with them directly.`, { duration: 8000 });
                    }
                }
            } catch (emailError) {
                console.error("Error sending trade creation emails: ", emailError);
            }

            router.push(`/dashboard/view-room/${roomId}`);
        } catch (error) {
            console.error("Error creating trade: ", error);
            setError("Error creating trade.");
            setIsCreating(false);
        }
    };

    return (
        <>
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-2">
                        <Image src="https://peershieldex.com/assets/images/icon-convert.svg" alt="" width={40} height={40} />
                    </div>
                    <CardTitle>Start Trade</CardTitle>
                    <CardDescription>Exchange crypto securely with our custom-developed Escrow system.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <p className="text-red-500 text-center">{error}</p>}

                        {/* Role Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Select Your Role</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Button type="button" variant={traderRole === 'seller' ? 'default' : 'secondary'} onClick={() => setTraderRole('seller')} className="flex-1">Seller</Button>
                                    <Button type="button" variant={traderRole === 'buyer' ? 'default' : 'secondary'} onClick={() => setTraderRole('buyer')} className="flex-1">Buyer</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seller's Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Seller's Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <div className="w-full md:w-1/3 cursor-pointer" onClick={() => { setIsModalOpen(true); setCurrentTokenSide('1'); }}>
                                        <div className="flex items-center justify-between gap-2 p-2 rounded-md border">
                                            <div className="flex items-center gap-2">
                                                {sellersToken ? (
                                                    <>
                                                        <Image src={sellersToken.image} alt="" width={24} height={24} onError={(e) => e.currentTarget.src = 'https://peershieldex.com/assets/images/token.png'} />
                                                        <span className="font-semibold">{sellersToken.name}</span>
                                                    </>
                                                ) : (
                                                    <span className="font-semibold">Select coin</span>
                                                )}
                                            </div>
                                            <LuChevronDown />
                                        </div>
                                    </div>
                                    <Input type="number" placeholder="Amount to sell" value={sellerAmount} onChange={(e) => setSellerAmount(e.target.value)} className="text-right text-lg font-bold flex-1 w-full" required />
                                </div>
                                <Input type="email" placeholder="Seller's Email" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} readOnly={traderRole === 'seller'} className={traderRole === 'seller' ? 'bg-muted' : ''} required />
                            </CardContent>
                        </Card>

                        <div className="flex justify-center my-4 md:my-0">
                            <Button variant="ghost" size="icon" type="button">
                                <LuArrowUpDown className="h-6 w-6 md:hidden" />
                                <LuArrowLeftRight className="h-6 w-6 hidden md:block" />
                            </Button>
                        </div>

                        {/* Buyer's Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Buyer's Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <div className="w-full md:w-1/3 cursor-pointer" onClick={() => { setIsModalOpen(true); setCurrentTokenSide('2'); }}>
                                        <div className="flex items-center justify-between gap-2 p-2 rounded-md border">
                                            <div className="flex items-center gap-2">
                                                {buyersToken ? (
                                                    <>
                                                        <Image src={buyersToken.image} alt="" width={24} height={24} onError={(e) => e.currentTarget.src = 'https://peershieldex.com/assets/images/token.png'} />
                                                        <span className="font-semibold">{buyersToken.name}</span>
                                                    </>
                                                ) : (
                                                    <span className="font-semibold">Select coin</span>
                                                )}
                                            </div>
                                            <LuChevronDown />
                                        </div>
                                    </div>
                                    <Input type="number" placeholder="Amount to buy" value={buyerAmount} onChange={(e) => setBuyerAmount(e.target.value)} className="text-right text-lg font-bold flex-1 w-full" required />
                                </div>
                                <Input type="email" placeholder="Buyer's Email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} readOnly={traderRole === 'buyer'} className={traderRole === 'buyer' ? 'bg-muted' : ''} required />
                            </CardContent>
                        </Card>

                        {/* Fee */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Fee</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="font-semibold mb-2 block">Who pays the trade fee?</label>
                                    <Select value={feeSplit} onValueChange={setFeeSplit}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select who pays" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="equal">Split Equally</SelectItem>
                                            <SelectItem value="seller">Seller Pays</SelectItem>
                                            <SelectItem value="buyer">Buyer Pays</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="text-sm">
                                    <span className="font-semibold">Exchange Fee:</span> 2%
                                </div>
                            </CardContent>
                        </Card>

                        <Button type="submit" className="w-full" disabled={isCreating}>
                            {isCreating ? 'Creating Trade...' : 'Start Trade'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <TokenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectToken={handleTokenSelect} />
        </>
    );
}
