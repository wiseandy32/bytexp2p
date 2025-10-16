"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle, FiChevronDown, FiGitCommit, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../app/context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { useRouter } from "next/navigation";

const EstimatedTotalAssets = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [wallets, setWallets] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const fetchUserWallets = async () => {
        // Get all cryptocurrencies
        const cryptoQuery = query(collection(db, 'cryptocurrencies'));
        const cryptoSnapshot = await getDocs(cryptoQuery);
        const cryptoMap = new Map();
        cryptoSnapshot.forEach((doc) => {
          const data = doc.data();
          cryptoMap.set(data.shortName, { name: data.name, logoUrl: data.logoUrl });
        });

        // Get user balances
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const balances = userData.balances || {};

          const userWallets = Object.keys(balances).map((shortName) => {
            const crypto = cryptoMap.get(shortName);
            return {
              name: crypto ? crypto.name : shortName,
              shortName,
              balance: balances[shortName],
              icon: crypto ? crypto.logoUrl : '',
            };
          });

          setWallets(userWallets);
          if (userWallets.length > 0) {
            setSelectedWallet(userWallets[0]);
          }
        }
      };

      fetchUserWallets();
    }
  }, [user]);


  const handleSelectWallet = (wallet) => {
    setSelectedWallet(wallet);
    setIsOpen(false);
  };

  if (!selectedWallet) {
    return (
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg hover:bg-gray-800 transition-colors duration-300 relative">
            <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">Est. Total Assets</p>
                <a href="#">
                    <FiArrowRight className="text-gray-400 hover:text-white" />
                </a>
            </div>
            <div className="relative mt-4">
                <div className="bg-gray-800 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <div>
                            <p className="text-white font-bold">Loading...</p>
                            <p className="text-gray-500 text-xs">Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl shadow-lg hover:bg-gray-800 transition-colors duration-300 relative">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">Est. Total Assets</p>
        <a href="#">
          <FiArrowRight className="text-gray-400 hover:text-white" />
        </a>
      </div>
      <div className="relative mt-4">
        <div
          className="bg-gray-800 p-3 rounded-lg flex items-center justify-between cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <img src={selectedWallet.icon} alt={selectedWallet.name} className="w-6 h-6 mr-3 rounded-full" />
            <div>
              <p className="text-white font-bold">{selectedWallet.balance}</p>
              <p className="text-gray-500 text-xs">{selectedWallet.name}</p>
            </div>
          </div>
          <FiChevronDown className="text-gray-400" />
        </div>
        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg z-10 h-64 overflow-y-auto">
            {wallets.map(wallet => (
              <div
                key={wallet.shortName}
                className="flex items-center p-3 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleSelectWallet(wallet)}
              >
                <img src={wallet.icon} alt={wallet.name} className="w-6 h-6 mr-3 rounded-full" />
                <p className="text-white flex-1">{wallet.name}</p>
                <p className="text-gray-400">{wallet.balance}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Activity = () => {
    const [activeTrades, setActiveTrades] = useState(0);
    const [completedTrades, setCompletedTrades] = useState(0);
    const { user } = useAuth();

    useEffect(() => {
        if(user && user.uid) {
            const fetchTrades = async () => {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (!userDocSnap.exists()) return;
                const userData = userDocSnap.data();
                const userEmail = userData.email;
                if (!userEmail) return;

                const tradesRef = collection(db, "trades");
                const qBuyer = query(tradesRef, where("buyerEmail", "==", userEmail));
                const qSeller = query(tradesRef, where("sellerEmail", "==", userEmail));

                const [buyerSnap, sellerSnap] = await Promise.all([
                    getDocs(qBuyer),
                    getDocs(qSeller)
                ]);

                const trades = new Map();
                buyerSnap.forEach(doc => trades.set(doc.id, doc.data()));
                sellerSnap.forEach(doc => trades.set(doc.id, doc.data()));

                let activeCount = 0;
                let completedCount = 0;
                trades.forEach(trade => {
                    if (trade.status === "completed") {
                        completedCount++;
                    } else {
                        activeCount++;
                    }
                });
                setActiveTrades(activeCount);
                setCompletedTrades(completedCount);
            };

            fetchTrades();
        }
    }, [user])

    return (
        <div className="mt-3">
            <h2 className="text-lg font-semibold text-gray-200 mb-4">Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EstimatedTotalAssets />
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl flex items-center shadow-lg hover:bg-gray-800 transition-colors duration-300">
                <div className="bg-blue-600 p-3 rounded-full">
                <FiTrendingUp className="text-white" size={24} />
                </div>
                <div className="ml-4">
                <p className="text-gray-400 text-sm">Active Trades</p>
                <p className="text-white text-2xl font-bold">{activeTrades} <span className="text-base font-normal text-gray-500">Trades</span></p>
                </div>
            </div>
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl flex items-center shadow-lg hover:bg-gray-800 transition-colors duration-300">
                <div className="bg-green-600 p-3 rounded-full">
                <FiCheckCircle className="text-white" size={24} />
                </div>
                <div className="ml-4">
                <p className="text-gray-400 text-sm">Completed Trades</p>
                <p className="text-white text-2xl font-bold">{completedTrades} <span className="text-base font-normal text-gray-500">Trades</span></p>
                </div>
            </div>
            </div>
        </div>
    )
};

const getTradeProgress = (status) => {
    const progressMap = {
        pending: { percentage: 15, statusText: "Trade Created" },
        joined: { percentage: 30, statusText: "Both Parties Joined" },
        buyer_deposited: { percentage: 60, statusText: "Buyer Has Deposited" },
        seller_deposited: { percentage: 60, statusText: "Seller Has Deposited" },
        ready_to_withdraw: { percentage: 80, statusText: "Ready for Withdrawal" },
        completed: { percentage: 100, statusText: "Trade Completed" },
        cancelled: { percentage: 0, statusText: "Trade Cancelled" },
    };
    return progressMap[status] || { percentage: 0, statusText: 'Unknown Status' };
};

const TradeItem = ({ trade, currentUserEmail }) => {
    const { percentage, statusText } = getTradeProgress(trade.status);
    const otherPartyEmail = trade.buyerEmail === currentUserEmail ? trade.sellerEmail : trade.buyerEmail;

    const statusColor = {
        completed: 'text-green-400',
        cancelled: 'text-red-400',
        pending: 'text-yellow-400',
        joined: 'text-blue-400',
        buyer_deposited: 'text-blue-400',
        seller_deposited: 'text-blue-400',
        ready_to_withdraw: 'text-teal-400',
    }[trade.status] || 'text-gray-400';

    const progressBarColor = {
        completed: 'bg-green-500',
        cancelled: 'bg-red-500',
    }[trade.status] || 'bg-blue-500';


    return (
        <Link href={`/dashboard/view-room/${trade.roomId}`} key={trade.id} className="block bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white font-semibold">
                        {trade.sellersToken?.name} for {trade.buyersToken?.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                        With: {otherPartyEmail}
                    </p>
                </div>
                <div className="text-right">
                    <p className={`text-sm font-medium ${statusColor}`}>{statusText}</p>
                </div>
            </div>
            <div className="mt-2 h-1 w-full bg-gray-600 rounded">
                <div
                    className={`h-1 rounded ${progressBarColor}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </Link>
    );
}

const YourTrades = () => {
    const [trades, setTrades] = useState([]);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user && user.uid) {
            const fetchUserTrades = async () => {
                const userDocRef = doc(db, 'users', user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (!userDocSnap.exists()) return;
                const userEmail = userDocSnap.data().email;
                if (!userEmail) return;

                setCurrentUserEmail(userEmail);

                const tradesRef = collection(db, 'trades');
                const qBuyer = query(tradesRef, where('buyerEmail', '==', userEmail));
                const qSeller = query(tradesRef, where('sellerEmail', '==', userEmail));

                const [buyerSnap, sellerSnap] = await Promise.all([
                    getDocs(qBuyer),
                    getDocs(qSeller)
                ]);

                const userTradesMap = new Map();
                buyerSnap.forEach(doc => userTradesMap.set(doc.id, { id: doc.id, ...doc.data() }));
                sellerSnap.forEach(doc => userTradesMap.set(doc.id, { id: doc.id, ...doc.data() }));

                const sortedTrades = Array.from(userTradesMap.values()).sort((a, b) => {
                    const dateA = a.createdAt?.toMillis() || 0;
                    const dateB = b.createdAt?.toMillis() || 0;
                    return dateB - dateA;
                });

                setTrades(sortedTrades);
            };

            fetchUserTrades();
        }
    }, [user]);

    return (
        <div className="bg-gray-900 border border-gray-700 p-6 mt-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-200">Your Trades</h3>
                <Link href="/dashboard/my-exchanges" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
                    See all <FiArrowRight className="ml-2" />
                </Link>
            </div>
            {trades.length > 0 ? (
                <div className="space-y-4">
                    {trades.slice(0, 3).map(trade => (
                        <TradeItem key={trade.id} trade={trade} currentUserEmail={currentUserEmail} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 border-t border-gray-700">
                    <FiGitCommit className="text-gray-600 mx-auto" size={48} />
                    <p className="text-gray-500 mt-4">No trade data available.</p>
                </div>
            )}
        </div>
    )
};

const RecentTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const fetchTransactions = async () => {
                try {
                    const q = query(collection(db, "transactions"), where("userId", "==", user.uid));
                    const snap = await getDocs(q);
                    const trans = [];
                    snap.forEach(doc => {
                        trans.push({ id: doc.id, ...doc.data() });
                    });

                    const sortedTrans = trans.sort((a, b) => {
                        const dateA = a.date?.toDate() || 0;
                        const dateB = b.date?.toDate() || 0;
                        return dateB - dateA;
                    });

                    setTransactions(sortedTrans.slice(0, 5));
                } catch (error) {
                    console.error("Error fetching transactions:", error);
                }
            };

            fetchTransactions();
        }
    }, [user]);

    return (
    <div className="bg-gray-900 border border-gray-700 p-6 mt-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">Recent Transactions</h3>
        <Link href="/dashboard/transactions" className="text-blue-400 hover:text-blue-300 text-sm font-medium">See all</Link>
      </div>
      <div className="space-y-4">
        {transactions.map(t => (
            <TransactionItem key={t.id} status={t.status} transactionId={t.transactionId} createdAt={t.createdAt} amount={t.amount} type={t.type} />
        ))}
      </div>
    </div>
  )};

  const TransactionItem = ({ status, transactionId, createdAt, amount, type }) => {
  const router = useRouter();
    
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

    const handleRowClick = (id: string) => {
      router.push(`/dashboard/transactions/${id}`);
    };
  
    return (
      <div onClick={() => handleRowClick(transactionId)} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-300">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-4 ${getStatusClasses(status)}`}></div>
          <div>
            <p className="text-white font-semibold">{transactionId}</p>
            <p className="text-gray-400 text-sm">{createdAt ? createdAt.toDate().toLocaleString() : ""}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-bold">{amount}</p>
          <p className={`text-sm font-medium ${type === 'Credit' ? 'text-green-400' : 'text-red-400'}`}>{type}</p>
        </div>
      </div>
    );
  };

export default function Overview() {
  return (
    <div className="p-4 md:p-6">
      <Activity />
      <YourTrades />
      <RecentTransactions />
    </div>
  );
}
