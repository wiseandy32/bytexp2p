'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

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

export default function Transactions() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(
        collection(db, "transactions"),
        where("userId", "==", user.uid)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userTransactions: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          userTransactions.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(userTransactions);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/transactions/${id}`);
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'awaiting_payment':
        return "bg-amber-100 text-amber-800";
      case 'awaiting_approval':
        return "bg-blue-100 text-blue-800";
      case 'approved':
        return "bg-green-100 text-green-800";
      case 'rejected':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>A list of your recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                onClick={() => handleRowClick(transaction.id)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>
                  {transaction.amount} {transaction.token.shortName}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusClasses(transaction.status)}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {transaction.createdAt.toDate().toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
