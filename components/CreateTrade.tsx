'use client';

import { useState, FormEvent } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CreateTrade() {
  const [cryptocurrency, setCryptocurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [terms, setTerms] = useState('');

  const handleCreateTrade = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cryptocurrency && amount && price && terms) {
      try {
        await addDoc(collection(db, 'trades'), {
          creatorId: auth.currentUser?.uid,
          cryptocurrency,
          amount: parseFloat(amount),
          price: parseFloat(price),
          terms,
          status: 'open',
          createdAt: serverTimestamp(),
        });
        // Reset form fields
        setCryptocurrency('');
        setAmount('');
        setPrice('');
        setTerms('');
      } catch (error) {
        console.error("Error creating trade: ", error);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Trade</CardTitle>
        <CardDescription>
          Fill in the details to create a new trade.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateTrade} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="cryptocurrency">Cryptocurrency</Label>
            <Input
              id="cryptocurrency"
              placeholder="e.g., Bitcoin"
              value={cryptocurrency}
              onChange={(e) => setCryptocurrency(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="e.g., 0.5"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price (per unit)</Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g., 50000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="terms">Terms of Trade</Label>
            <Textarea
              id="terms"
              placeholder="Describe the terms of your trade"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Create Trade</Button>
        </form>
      </CardContent>
    </Card>
  );
}
