
'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LuArrowLeftRight, LuChevronDown } from 'react-icons/lu';
import TokenModal from '@/components/TokenModal';
import { useRouter } from 'next/navigation';

export default function CreateTradePage() {
    const router = useRouter();
    const [traderRole, setTraderRole] = useState('seller');
    const [sellerAmount, setSellerAmount] = useState('');
    const [buyerAmount, setBuyerAmount] = useState('');
    const [sellerEmail, setSellerEmail] = useState('');
    const [buyerEmail, setBuyerEmail] = useState('');
    const [feeSplit, setFeeSplit] = useState('equal');
    const [token1Name, setToken1Name] = useState('0G');
    const [token2Name, setToken2Name] = useState('0G');
    const [token1Image, setToken1Image] = useState('https://peershieldex.com/uploads/coins/17586300050_g_labs1758534215903.png');
    const [token2Image, setToken2Image] = useState('https://peershieldex.com/uploads/coins/17586300050_g_labs1758534215903.png');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTokenSide, setCurrentTokenSide] = useState('1');

    const handleTokenSelect = (token: { name: string, image: string }) => {
        if (currentTokenSide === '1') {
            setToken1Name(token.name);
            setToken1Image(token.image);
        } else {
            setToken2Name(token.name);
            setToken2Image(token.image);
        }
        setIsModalOpen(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const roomid = Math.random().toString(36).substring(2, 8).toUpperCase();
        router.push(`/dashboard/view-room/${roomid}`);
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
                        <Card>
                            <CardHeader>
                                <CardTitle>You Send</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <div className="w-1/3 cursor-pointer" onClick={() => { setIsModalOpen(true); setCurrentTokenSide('1'); }}>
                                    <div className="flex items-center justify-between gap-2 p-2 rounded-md border">

                                        <div className="flex items-center gap-2">
                                            <Image src={token1Image} alt="" width={24} height={24} onError={(e) => e.currentTarget.src = 'https://peershieldex.com/assets/images/token.png'} />
                                            <span className="font-semibold">{token1Name}</span>
                                        </div>
                                        <LuChevronDown />
                                    </div>
                                </div>
                                <Input type="number" placeholder="0.00" value={sellerAmount} onChange={(e) => setSellerAmount(e.target.value)} className="text-right text-lg font-bold flex-1" />
                            </CardContent>
                        </Card>

                        <div className="flex justify-center">
                            <Button variant="ghost" size="icon">
                                <LuArrowLeftRight className="h-6 w-6" />
                            </Button>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>You Receive</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <div className="w-1/3 cursor-pointer" onClick={() => { setIsModalOpen(true); setCurrentTokenSide('2'); }}>
                                    <div className="flex items-center justify-between gap-2 p-2 rounded-md border">
                                        <div className="flex items-center gap-2">
                                            <Image src={token2Image} alt="" width={24} height={24} onError={(e) => e.currentTarget.src = 'https://peershieldex.com/assets/images/token.png'} />
                                            <span className="font-semibold">{token2Name}</span>
                                        </div>
                                        <LuChevronDown />
                                    </div>
                                </div>
                                <Input type="number" placeholder="0.00" value={buyerAmount} onChange={(e) => setBuyerAmount(e.target.value)} className="text-right text-lg font-bold flex-1" />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Trade Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="font-semibold mb-2 block">Select your role</label>
                                    <div className="flex gap-2">
                                        <Button variant={traderRole === 'seller' ? 'default' : 'secondary'} onClick={() => setTraderRole('seller')} className="flex-1">Seller</Button>
                                        <Button variant={traderRole === 'buyer' ? 'default' : 'secondary'} onClick={() => setTraderRole('buyer')} className="flex-1">Buyer</Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input type="email" placeholder="Seller's Email" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} />
                                    <Input type="email" placeholder="Buyer's Email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Fee Configuration</CardTitle>
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

                        <Button type="submit" className="w-full">Start Trade</Button>
                    </form>
                </CardContent>
            </Card>
            <TokenModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectToken={handleTokenSelect} />
        </>
    );
}
