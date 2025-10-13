'use client';

import { useSearchParams } from 'next/navigation';
import { FiClipboard } from 'react-icons/fi';
import Link from 'next/link';

export default function DepositAddressPage() {
  const searchParams = useSearchParams();
  const token = JSON.parse(searchParams.get('token'));
  const amount = searchParams.get('amount');

  const address = '0xcf0dABf483Dd938dC1db035Dc4E5E63CAc720d5A';
  const transactionRef = '#TXNPSTWO2QU';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
  };

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
                <p className="m-0 text-sm">{transactionRef}</p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="m-0 text-sm text-gray-400">Status</p>
                <span className="bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded">Waiting</span>
              </div>
            </div>

            <div className="bg-gray-800 p-3 mt-4 hidden md:block rounded-md">
              <p className="m-0 text-gray-400 font-bold">{token.shortName} ({token.name}) Deposit Address</p>
              <div className="flex items-center mt-2">
                <p className="text-sm font-bold break-all flex-1">{address}</p>
                <FiClipboard className="text-gray-400 cursor-pointer ml-4" onClick={copyToClipboard} />
              </div>
              <small className="text-red-500 text-xs mt-2 block">*Send only <b>{token.shortName}</b> to this address to avoid loss of fund.</small>
              <Link href={`/dashboard/deposit/confirm?token=${JSON.stringify(token)}&amount=${amount}`}>
                <button className="text-sm font-bold mt-5 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md">
                  Confirm Payment
                </button>
              </Link>
            </div>
          </div>

          <div>
            <div className="bg-gray-800 p-4 rounded-md flex flex-col items-center">
              <div className="bg-white p-5 rounded-md">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${address}`} alt={`${token.name} address QR code`} className="w-40 h-40" />
              </div>
              <small className="text-xs text-gray-400 mt-4 text-center">
                Please use your wallet or exchange account to send fund to the address by copying it or scanning the QR code; then proceed to Confirm payment.
              </small>
            </div>
          </div>

          <div className="md:hidden bg-gray-800 p-3 mt-4 rounded-md">
            <p className="m-0 text-gray-400 font-bold">{token.shortName} ({token.name}) Deposit Address</p>
            <div className="flex items-center mt-2">
              <p className="text-sm font-bold break-all flex-1">{address}</p>
              <FiClipboard className="text-gray-400 cursor-pointer ml-4" onClick={copyToClipboard} />
            </div>
            <small className="text-red-500 text-xs mt-2 block">*Send only <b>{token.shortName}</b> to this address to avoid loss of fund.</small>
            <Link href={`/dashboard/deposit/confirm?token=${JSON.stringify(token)}&amount=${amount}`}>
              <button className="text-sm font-bold mt-5 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md">
                Confirm Payment
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
