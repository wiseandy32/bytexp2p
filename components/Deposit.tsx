'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Token } from '@/lib/data';
import TokenModal from './TokenModal';
import { FiChevronDown, FiInfo } from 'react-icons/fi';

export default function Deposit() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState('');
  const router = useRouter();

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token);
    setModalOpen(false);
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedToken && amount) {
      try {
        const docRef = await addDoc(collection(db, 'transactions'), {
          userId: auth.currentUser?.uid,
          token: selectedToken,
          amount: parseFloat(amount),
          status: 'awaiting_payment',
          createdAt: serverTimestamp(),
          type: 'deposit',
        });

        const newDocRef = doc(db, 'transactions', docRef.id);
        await updateDoc(newDocRef, {
          transactionId: docRef.id,
        });

        router.push(`/dashboard/deposit/${docRef.id}`);
      } catch (error) {
        console.error("Error creating deposit: ", error);
      }
    }
  };

  return (
    <div className="lg:px-5 mt-4 text-white">
      <div className="bg-gray-900 pb-4">
        <div className="flex border-b border-gray-700 p-3">
          <p className="m-0 text-sm font-bold">Deposit</p>
        </div>

        <form onSubmit={handleFormSubmit} id="depositForm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
            <div className="lg:col-span-7">
              {/* Step 1 */}
              <div className="px-3 pb-3">
                <div className="flex items-center mb-2">
                  <span className="font-sans py-1 px-2 text-xs w-fit bg-gray-700 text-blue-400 rounded">1</span>
                  <p className="m-0 ml-4 text-sm">Select Coin/Token</p>
                </div>
                <div className="pl-10">
                  <div 
                    className="p-3 bg-gray-800 rounded-md flex items-center cursor-pointer mt-2"
                    onClick={() => setModalOpen(true)}
                  >
                    {selectedToken ? (
                      <>
                        <img src={selectedToken.logoUrl} alt={selectedToken.shortName} className="w-5 h-5 mr-3" />
                        <p className="font-bold m-0 flex-grow">{selectedToken.shortName} <span className="ml-3 text-xs text-gray-400 font-normal">{selectedToken.name}</span></p>
                      </>
                    ) : (
                      <p className="font-bold m-0 flex-grow">Select <span className="ml-3 text-xs text-gray-400 font-normal">Crypto</span></p>
                    )}
                    <input type="hidden" name="currency_id" id="tokenId" value={selectedToken?.shortName || ''} required />
                    <FiChevronDown />
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="px-3 pb-3">
                 <div className="flex items-center mb-2">
                  <span className="font-sans py-1 px-2 text-xs w-fit bg-gray-700 text-blue-400 rounded">2</span>
                  <p className="m-0 ml-4 text-sm">Enter Amount</p>
                </div>
                <div className="pl-10 mt-2">
                  <input
                    type="number"
                    name="amount"
                    id="fundAmount"
                    className="bg-gray-800 w-full font-bold border-none rounded-md py-3 px-3 focus:outline-none"
                    placeholder="0.00"
                    step="any"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <small className="text-red-500 text-xs hidden mt-1">
                    Please enter a valid amount
                  </small>
                </div>
              </div>

              {/* Step 3 */}
              <div className="px-3 pb-3">
                <div className="flex items-center mb-2">
                  <span className="font-sans py-1 px-2 text-xs w-fit bg-gray-700 text-blue-400 rounded">3</span>
                  <p className="m-0 ml-4 text-sm">Generate Deposit Address</p>
                </div>
                <div className="pl-10 mt-2">
                  <div className="flex items-start bg-gray-800 p-3 rounded-md">
                    <FiInfo className="text-blue-400 mt-1 mr-2 flex-shrink-0" size={24}/>
                    <small className="text-xs text-gray-400">
                      Only deposit to addresses generated on our server. Do not pay to third party addresses to avoid loss of fund.
                    </small>
                  </div>
                  <button className="mt-4 py-2 text-sm w-fit px-4 bg-blue-600 hover:bg-blue-700 rounded-md" type="submit">
                    Generate deposit address
                  </button>
                </div>
              </div>

              <p className="px-3 text-sm text-gray-400">
                Cryptocurrency not listed? <a href="#" className="text-blue-400 hover:underline">Request currency listing</a>
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="lg:border-l lg:border-gray-700 h-full">
                <div className="p-3 lg:ml-4">
                  <div className="flex items-center">
                    <div>
                      <img src={selectedToken?.logoUrl} alt={selectedToken?.shortName} className="w-9 h-9" />
                    </div>
                    <div className="ml-3 flex-1">
                      <small className="text-xs text-gray-200 mb-1 block">Available Asset</small>
                      <p className="text-xs m-0 font-bold text-gray-400">Current balance (Est.)</p>
                    </div>
                    <p className="m-0 font-bold">{selectedToken ? `0 ${selectedToken.shortName}` : '0.00'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <TokenModal 
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)} 
          onSelectToken={handleSelectToken} 
        />
      </div>
    </div>
  );
}
