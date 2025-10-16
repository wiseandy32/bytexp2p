'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  createdAt: {
    toDate: () => Date;
  };
  type: string;
  token: {
    shortName: string;
  };
}

export default function TransactionDetails() {
  const { reference } = useParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (reference) {
      const fetchTransaction = async () => {
        const docRef = doc(db, "transactions", reference as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTransaction({ id: docSnap.id, ...docSnap.data() } as Transaction);
        }
      };
      fetchTransaction();
    }
  }, [reference]);

  if (!transaction) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Details</CardTitle>
        <CardDescription>Details for transaction {transaction.id}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Status</TableCell>
                <TableCell>{transaction.status}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Amount</TableCell>
                <TableCell>{transaction.amount} {transaction.token.shortName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Type</TableCell>
                <TableCell>{transaction.type}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex gap-2">
            <Link href={`/dashboard/deposit/${transaction.id}`} className="w-full">
                <Button variant="secondary" className="w-full">Make Payment</Button>
            </Link>
            <Link href={`/dashboard/deposit/${transaction.id}/confirm`} className="w-full">
                <Button className="w-full">Confirm Payment</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
