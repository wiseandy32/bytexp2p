'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { toast } from 'sonner';

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
  proofOfPayment: string;
  userId: string;
  txHash: string;
}

export default function AdminTransactionDetails() {
  const { transactionId } = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    if (transactionId) {
      const fetchTransaction = async () => {
        const docRef = doc(db, "transactions", transactionId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTransaction({ id: docSnap.id, ...docSnap.data() } as Transaction);
        }
      };
      fetchTransaction();
    }
  }, [transactionId]);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!transaction) return;

    const transactionRef = doc(db, 'transactions', transactionId as string);

    if (action === 'approve') {
      try {
        const userRef = doc(db, 'users', transaction.userId);
        await updateDoc(userRef, {
          [`balances.${transaction.token.shortName}`]: increment(transaction.amount)
        });

        await updateDoc(transactionRef, {
          status: 'approved',
        });
        
        toast.success('Deposit approved successfully!');
        router.push('/admin/transactions');
      } catch (error) {
        console.error(`Error approving transaction ${transactionId}:`, error);
        toast.error('An error occurred while approving the deposit.');
      }
    } else { // 'reject'
      try {
        await updateDoc(transactionRef, {
          status: 'rejected',
        });
        toast.success('Deposit rejected successfully!');
        router.push('/admin/transactions');
      } catch (error) {
        console.error(`Error rejecting transaction ${transactionId}:`, error);
        toast.error('An error occurred while rejecting the deposit.');
      }
    }
  };

  if (!transaction) {
    return <div>Loading...</div>;
  }

  return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
              <p><strong>User ID:</strong> {transaction.userId}</p>
              <p><strong>Amount:</strong> {transaction.amount} {transaction.token.shortName}</p>
              <div><strong>Status:</strong> <Badge variant={transaction.status === 'approved' ? 'default' : transaction.status === 'awaiting_approval' ? 'secondary' : 'destructive'}>{transaction.status}</Badge></div>
              <p><strong>Date:</strong> {transaction.createdAt.toDate().toLocaleDateString()}</p>
              <p><strong>Transaction Hash:</strong> {transaction.txHash}</p>
              <p><strong>Proof of Payment:</strong></p>
              <img src={transaction.proofOfPayment} alt="Proof of Payment" className="w-full max-w-md rounded-md" />
              <div className="flex gap-4">
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button disabled={transaction.status !== 'awaiting_approval'}>Approve</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to approve this deposit?</AlertDialogTitle>
                          <AlertDialogDescription>
                              This action will credit the user's account with {transaction.amount} {transaction.token.shortName}. This action cannot be undone.
                          </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleAction('approve')}>Approve</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                          <Button variant="destructive" disabled={transaction.status !== 'awaiting_approval'}>Reject</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to reject this deposit?</AlertDialogTitle>
                          <AlertDialogDescription>
                              This will mark the transaction as rejected. This action cannot be undone.
                          </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleAction('reject')}>Reject</AlertDialogAction>
                          </AlertDialogFooter>
                      </AlertDialogContent>
                  </AlertDialog>
              </div>
          </div>
        </CardContent>
      </Card>
  );
}
