'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiClipboard } from 'react-icons/fi';

interface TransactionData {
  token: {
    name: string;
    shortName: string;
    depositAddress: string;
    logoUrl: string;
    qrCodeUrl: string;
    network: string;
  };
  amount: number;
  status: string;
  type: 'deposit' | 'withdrawal';
}

export default function DepositDetailsPage() {
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const { transactionId } = useParams();

  useEffect(() => {
    if (transactionId) {
      const fetchTransaction = async () => {
        const docRef = doc(db, 'transactions', transactionId as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTransaction(docSnap.data() as TransactionData);
        }
        setLoading(false);
      };
      fetchTransaction();
    }
  }, [transactionId]);

  const copyToClipboard = () => {
    if (transaction?.token.depositAddress) {
      navigator.clipboard.writeText(transaction.token.depositAddress);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-white">Loading...</div>;
  }

  if (!transaction) {
    return <div className="flex justify-center items-center min-h-screen text-white">Transaction not found.</div>;
  }

  const { token, amount, status } = transaction;

  return (
    <div className="lg:px-5 mt-4 text-white">
      <div className="bg-gray-900 pb-4">
        <div className="flex border-b border-gray-700 p-3">
          <p className="m-0 text-sm font-bold flex-1">Deposit {token.shortName}</p>
          <p className="m-0 ml-3 text-blue-400 text-sm">Complete payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 px-4">
          <div>
            <div className="bg-gray-800 p-4 rounded-md">
              <p className="m-0 mb-2 font-bold text-gray-400">Order Summary</p>
              <div className="flex justify-between">
                <p className="m-0 text-sm text-gray-400">Amount</p>
                <p className="m-0 text-sm">{amount} {token.shortName}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="m-0 text-sm text-gray-400">Ref</p>
                <p className="m-0 text-sm break-all">{transactionId}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="m-0 text-sm text-gray-400">Status</p>
                <span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded capitalize">{status}</span>
              </div>
            </div>

            <div className="bg-gray-800 p-3 mt-4 rounded-md">
              <p className="m-0 text-gray-400 font-bold">{token.shortName} ({token.name}) Deposit Address</p>
              <div className="flex items-center mt-2">
                <p className="text-sm font-bold break-all flex-1">{token.depositAddress}</p>
                <FiClipboard className="text-gray-400 cursor-pointer ml-4" onClick={copyToClipboard} />
              </div>
              <p className="text-xs text-gray-500 mt-2">Network: {token.network}</p>
              <small className="text-red-500 text-xs mt-2 block">*Send only <b>{token.shortName}</b> to this address to avoid loss of fund.</small>
              <div className="w-full bg-yellow-900 text-yellow-300 p-4 rounded-lg mt-6">
                <p className="font-bold">Important Notice:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Only send {token.shortName} ({token.network}) to this address.</li>
                  <li>Sending any other coin to this address may result in the loss of your deposit.</li>
                  <li>The deposit will be credited after network confirmation.</li>
                </ul>
              </div>
              <Link href={`/dashboard/deposit/${transactionId}/confirm`}>
                <button className="text-sm font-bold mt-5 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md">
                  Confirm Payment
                </button>
              </Link>
            </div>
          </div>

          <div>
            <div className="bg-gray-800 p-4 rounded-md flex flex-col items-center">
              <div className="bg-white p-5 rounded-md">
                {token.qrCodeUrl && <img src={token.qrCodeUrl} alt={`${token.name} address QR code`} className="w-40 h-40" />}
              </div>
              <small className="text-xs text-gray-400 mt-4 text-center">
                Please use your wallet or exchange account to send fund to the address by copying it or scanning the QR code; then proceed to Confirm payment.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
