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

export default function JoinTradeDialog({ show, onHide }: { show: boolean; onHide: () => void }) {
    const [roomId, setRoomId] = useState("");
    const router = useRouter();

    const handleJoin = () => {
        if (roomId) {
            router.push(`/dashboard/view-room/${roomId}`);
        }
    };

    return (
        <Dialog open={show} onOpenChange={onHide}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Join Exchange Room</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                    <Button className="w-full" type="submit" onClick={handleJoin}>Join trade</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}