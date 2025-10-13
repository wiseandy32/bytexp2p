'use client';

import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";

export default function MyExchangesPage() {
    const exchanges = [
        {
            id: 'CVNK0o',
            status: 'Processing',
            role: 'seller',
            sendAmount: '200.00 0G',
            receiveAmount: '200.00 0G',
        },
    ];

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="text-center my-4">
                <h1 className="text-2xl font-bold">My Exchanges</h1>
                <p className="text-gray-500">Tap a room to open it</p>
            </div>

            {
                exchanges.map((exchange) => (
                    <Link href={`/dashboard/view-room/${exchange.id}`} key={exchange.id}>
                        <Card className="mb-3 cursor-pointer">
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center border-b pb-2 mb-2">
                                    <p className="text-sm">
                                        Status: <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs">{exchange.status}</span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500">Room ID</p>
                                        <p className="text-sm">{exchange.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500">Your Role</p>
                                        <p className="text-sm font-bold">{exchange.role}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500">Send</p>
                                        <p className="text-sm font-bold">{exchange.sendAmount}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500">Receive</p>
                                        <p className="text-sm font-bold">{exchange.receiveAmount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))
            }
        </div>
    );
}
