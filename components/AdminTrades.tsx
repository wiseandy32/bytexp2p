'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, onSnapshot, query, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface Trade {
  id: string;
  roomId: string;
  status: string;
  sellerEmail: string;
  buyerEmail: string;
  sellerAmount: number;
  sellersToken: { name: string };
  buyerAmount: number;
  buyersToken: { name: string };
  createdAt?: any;
}

export default function AdminTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'completed' | 'pending'>('all');
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, 'trades'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tradesData: Trade[] = [];
      snapshot.forEach((d) => {
        tradesData.push({ id: d.id, ...d.data() } as Trade);
      });
      
      tradesData.sort((a, b) => {
        if (a.status === 'under_review' && b.status !== 'under_review') return -1;
        if (a.status !== 'under_review' && b.status === 'under_review') return 1;
        
        if (a.createdAt && b.createdAt) {
          if (a.createdAt > b.createdAt) return -1;
          if (a.createdAt < b.createdAt) return 1;
        }
        return 0; // Default
      });
      
      setTrades(tradesData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const metrics = useMemo(() => {
    const total = trades.length;
    const open = trades.filter(t => t.status !== 'completed' && t.status !== 'cancelled').length;
    const completed = trades.filter(t => t.status === 'completed').length;
    const pending = trades.filter(t => t.status === 'under_review').length;
    return { total, open, completed, pending };
  }, [trades]);

  const filteredTrades = useMemo(() => {
    if (filter === 'all') return trades;
    if (filter === 'open') return trades.filter(t => t.status !== 'completed' && t.status !== 'cancelled');
    if (filter === 'completed') return trades.filter(t => t.status === 'completed');
    if (filter === 'pending') return trades.filter(t => t.status === 'under_review');
    return trades;
  }, [trades, filter]);

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'pending':
      case 'joined':
        return "bg-blue-100 text-blue-800";
      case 'buyer_deposited':
      case 'seller_deposited':
        return "bg-amber-100 text-amber-800";
      case 'under_review':
        return "bg-purple-100 text-purple-800";
      case 'ready_to_withdraw':
        return "bg-yellow-100 text-yellow-800";
      case 'completed':
        return "bg-green-100 text-green-800";
      case 'cancelled':
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRowClick = (roomId: string) => {
    router.push(`/admin/trades/${roomId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Trades Management</h2>
      
      {/* Metrics Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card 
          className={`cursor-pointer transition-colors border-2 ${filter === 'all' ? 'border-gray-500 shadow-md' : 'border-transparent hover:border-gray-300/50'}`}
          onClick={() => setFilter('all')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-colors border-2 ${filter === 'open' ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-300/50'}`}
          onClick={() => setFilter('open')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Open Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics.open}</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-colors border-2 ${filter === 'completed' ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-300/50'}`}
          onClick={() => setFilter('completed')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Completed Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{metrics.completed}</div>
          </CardContent>
        </Card>
        
        <Card 
          className={`cursor-pointer transition-colors border-2 ${filter === 'pending' ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-300/50'}`}
          onClick={() => setFilter('pending')}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{metrics.pending}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6 overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading trades...</div>
          ) : filteredTrades.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No {filter !== 'all' ? filter : ''} trades found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500 dark:text-gray-400">
                  <th className="pb-4 font-medium">Room ID</th>
                  <th className="pb-4 font-medium">Participants (Seller/Buyer)</th>
                  <th className="pb-4 font-medium">Exchange</th>
                  <th className="pb-4 font-medium text-right">Status</th>
                </tr>
              </thead>
                <tbody>
                {filteredTrades.map((trade) => (
                  <tr
                    key={trade.id}
                    onClick={() => handleRowClick(trade.roomId)}
                    className="border-b border-gray-100 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600/50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 font-mono">{trade.roomId}</td>
                    <td className="py-4">
                      <div className="truncate max-w-[150px]" title={trade.sellerEmail}>{trade.sellerEmail || 'N/A'}</div>
                      <div className="text-gray-500 truncate max-w-[150px]" title={trade.buyerEmail}>{trade.buyerEmail || 'Waiting...'}</div>
                    </td>
                    <td className="py-4">
                      <div>{trade.sellerAmount} {trade.sellersToken?.name}</div>
                      <div className="text-gray-500">for {trade.buyerAmount} {trade.buyersToken?.name}</div>
                    </td>
                    <td className="py-4 text-right">
                      <Badge className={`${getStatusClasses(trade.status)} border-0 text-xs px-2 py-0.5 whitespace-nowrap capitalize`}>
                        {trade.status.replace(/_/g, ' ')}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
