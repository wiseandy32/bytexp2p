'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Trade {
  id: string;
  cryptocurrency: string;
  amount: number;
  price: number;
  creatorId: string;
}

export default function JoinTrade() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'trades'), where('status', '==', 'open'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tradesData: Trade[] = [];
      snapshot.forEach((doc) => {
        tradesData.push({ id: doc.id, ...doc.data() } as Trade);
      });
      setTrades(tradesData);
    });
    return () => unsubscribe();
  }, []);

  const handleJoinTrade = async (trade: Trade) => {
    if (!auth.currentUser) return;

    try {
      // Check if a chat already exists between the two users for this trade
      const chatQuery = query(
        collection(db, 'chats'),
        where('tradeId', '==', trade.id),
        where('participants', 'array-contains', auth.currentUser.uid)
      );
      const chatSnapshot = await getDocs(chatQuery);

      if (chatSnapshot.empty) {
        // Create a new chat if one doesn't exist
        await addDoc(collection(db, 'chats'), {
          tradeId: trade.id,
          participants: [auth.currentUser.uid, trade.creatorId],
          createdAt: serverTimestamp(),
        });
      }

      // Update the trade to include the participant
      await updateDoc(doc(db, 'trades', trade.id), {
        participantId: auth.currentUser.uid,
        status: 'active',
      });

    } catch (error) {
      console.error("Error joining trade: ", error);
    }
  };

  const filteredTrades = trades.filter((trade) =>
    trade.cryptocurrency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search for trades..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cryptocurrency</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Price</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTrades.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell>{trade.cryptocurrency}</TableCell>
              <TableCell>{trade.amount}</TableCell>
              <TableCell>${trade.price}</TableCell>
              <TableCell>
                <Button onClick={() => handleJoinTrade(trade)}>Join</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
