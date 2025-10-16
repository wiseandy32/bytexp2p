'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function JoinTradeDialog({ show, onHide }: { show: boolean; onHide: () => void }) {
    const [roomId, setRoomId] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isJoining, setIsJoining] = useState(false);
    const router = useRouter();

    const handleJoin = async () => {
        setError(null);
        if (!roomId) {
            setError("Please enter a trade ID.");
            return;
        }

        if (!auth.currentUser) {
            setError("You must be logged in to join a trade.");
            return;
        }

        setIsJoining(true);
        const tradesCollectionRef = collection(db, 'trades');
        const q = query(tradesCollectionRef, where("roomId", "==", roomId));

        try {
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError("Trade not found.");
                return;
            }

            const tradeDoc = querySnapshot.docs[0];
            const tradeRef = tradeDoc.ref;
            const trade = tradeDoc.data();
            const currentUser = auth.currentUser;

            const isCreator = trade.creatorId === currentUser.uid;
            const isParticipant = trade.participantId && trade.participantId === currentUser.uid;

            if (isCreator || isParticipant) {
                router.push(`/dashboard/view-room/${trade.roomId}`);
                onHide();
                return;
            }
            
            const participantEmail = trade.traderRole === 'seller' ? trade.buyerEmail : trade.sellerEmail;
            if (participantEmail !== currentUser.email) {
                setError("You are not authorized to join this trade.");
                return;
            }

            if (trade.status !== 'pending') {
                setError("This trade is no longer available to join.");
                return;
            }

            await updateDoc(tradeRef, {
                participantId: auth.currentUser.uid,
                status: 'joined',
            });

            router.push(`/dashboard/view-room/${trade.roomId}`);
            onHide();
        } catch (err) {
            console.error(err);
            setError("An error occurred while trying to join the trade.");
        } finally {
            setIsJoining(false);
        }
    };

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Join Exchange Room</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {error && <p className="text-red-500 text-center p-2">{error}</p>}
                    <div className="flex flex-col gap-6">
                        <Label htmlFor="name" className="text-right">
                            Provide the exchange ID to join a trade
                        </Label>
                        <Input
                            id="name"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter exchange ID"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button className="w-full" type="submit" onClick={handleJoin} disabled={isJoining}>
                        {isJoining ? "Joining..." : "Join trade"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
