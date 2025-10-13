
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect, use } from "react";
import { LuClipboard, LuClipboardCheck } from "react-icons/lu";
import Link from "next/link";

export default function ViewRoomPage({ params }: { params: Promise<{ roomid: string }> }) {
    const { roomid } = use(params);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(roomid);
        setCopied(true);
    };

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => {
                setCopied(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [copied]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="text-center my-4 roboto">
                <Image src="https://peershieldex.com/assets/images/icon-convert.svg" alt="" width={40} height={40} className="inline-block"/>
                <span style={{fontSize: "20px"}} className="top-2 bold-text"> Trade Room</span>
                <small className="xsmall grey-color-2 block mt-2">
                    Share the room ID to the other party to join in the trade
                </small>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-md border"><Image alt="" loading="lazy" width="24" height="24" decoding="async" data-nimg="1" style={{color: "transparent"}} src="https://peershieldex.com/uploads/coins/17586300050_g_labs1758534215903.png" /><span className="font-semibold">0G</span></div>
            <Card className="mt-3 mb-3">
                <CardContent>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h4>Room ID: {roomid}</h4>
                            <Button variant="ghost" size="icon" onClick={handleCopy}>
                                {copied ? <LuClipboardCheck className="h-4 w-4" /> : <LuClipboard className="h-4 w-4" />}
                            </Button>
                        </div>
                        <div>
                            <a href="mailto:support@peershieldex.com">
                                <Button variant="destructive">Query Trade</Button>
                            </a>
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="flex justify-between">
                            <p className="text-gray-500">Your Role</p>
                            <p>Seller</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-500">Fee Payer</p>
                            <p>Split</p>
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
                        <p>realjohndoe8167@gmail.com</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-500">Sending</p>
                        <p>200.000 0G</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-500">Receiving</p>
                        <p>200.000 0G</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-500">Payment Status</p>
                        <p><span className="badge badge-warning">Waiting</span></p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-500">Withdrawal Status</p>
                        <p><span className="badge badge-dark">Not Available</span></p>
                    </div>
                </CardContent>
            </Card>
            <center><Image style={{backgroundColor:"black", padding:"10px", borderRadius:"50%"}} src="https://peershieldex.com/assets/images/swap.png" alt="swap" width="35" height="35" /></center>
            <Card className="mt-3">
                <CardHeader>
                    <CardTitle><h5><u>Buyer's Details</u></h5></CardTitle>
                </CardHeader>
                <CardContent>
                    <hr />

                    <div className="flex justify-between">
                        <p className="text-gray-500">Buyer's ID</p>
                        <p><span className="text-yellow-500">Waiting to join...</span></p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-500">Sending</p>
                        <p>200.000 0G</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-500">Receiving</p>
                        <p>200.000 0G</p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-500">Payment Status</p>
                        <p><span className="badge badge-warning">Waiting</span></p>
                    </div>

                    <div className="flex justify-between">
                        <p className="text-gray-500">Withdrawal Status</p>
                        <p><span className="badge badge-dark">Not Available</span></p>
                    </div>
                </CardContent>

            </Card>
            <Card className="mt-4">
                <CardContent>
                    <div className="flex justify-between">
                        <div>
                            <Link href={`/dashboard/deposit/address?roomId=${roomid}`}>
                                <Button>
                                    <i className="fas fa-download mr-3" aria-hidden="true"></i> Deposit Payment
                                </Button>
                            </Link>
                        </div>

                        <div>
                            <Button variant="secondary">
                                <i className="fas fa-wallet mr-3" aria-hidden="true"></i> Withdraw Token
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
