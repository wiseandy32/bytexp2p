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
    const isDeposit = transaction.type === 'deposit';

    if (action === 'approve') {
      try {
        const userDocRef = doc(db, 'users', transaction.userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const user = userDocSnap.data();
            const userEmail = user.email;

            const userRef = doc(db, 'users', transaction.userId);
            await updateDoc(userRef, {
            [`balances.${transaction.token.shortName}`]: increment(isDeposit ? transaction.amount : -transaction.amount)
            });

            await updateDoc(transactionRef, {
            status: 'approved',
            });

            const emailApiEndpoint = isDeposit ? '/api/send-deposit-approval-email' : '/api/send-withdrawal-approval-email';

            await fetch(emailApiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: userEmail,
                    amount: transaction.amount,
                    asset: transaction.token.shortName,
                    transactionLink: `${window.location.origin}/transactions/${transactionId}`,
                    transactionId: transactionId,
                }),
            });
            
            toast.success(`${isDeposit ? 'Deposit' : 'Withdrawal'} approved successfully!`);
            router.push('/admin/transactions');
        } else {
            toast.error('User not found');
        }
      } catch (error) {
        console.error(`Error approving transaction ${transactionId}:`, error);
        toast.error(`An error occurred while approving the ${isDeposit ? 'deposit' : 'withdrawal'}.`);
      }
    } else { // 'reject'
      try {
        await updateDoc(transactionRef, {
          status: 'rejected',
        });
        toast.success(`${isDeposit ? 'Deposit' : 'Withdrawal'} rejected successfully!`);
        router.push('/admin/transactions');
      } catch (error) {
        console.error(`Error rejecting transaction ${transactionId}:`, error);
        toast.error(`An error occurred while rejecting the ${isDeposit ? 'deposit' : 'withdrawal'}.`);
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
                          <AlertDialogTitle>Are you sure you want to approve this {transaction.type}?</AlertDialogTitle>
                          <AlertDialogDescription>
                              This action will {transaction.type === 'deposit' ? 'credit' : 'debit'} the user's account with {transaction.amount} {transaction.token.shortName}. This action cannot be undone.
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
                          <AlertDialogTitle>Are you sure you want to reject this {transaction.type}?</AlertDialogTitle>
                          <AlertDialogDescription>
                              This will mark the transaction as rejected. This action cannot be undone.
                          </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleAction('reject')}>Reject</AlertDialogAction>
                          </AlertDialogFooter >
                      </AlertDialogContent>
                  </AlertDialog>
              </div>
          </div>
        </CardContent>
      </Card>
  );
}
