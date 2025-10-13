"use client";

import { useState } from 'react';
import { FiArrowRight, FiCheckCircle, FiChevronDown, FiGitCommit, FiTrendingUp } from 'react-icons/fi';
import { wallets } from '../lib/wallets';

const EstimatedTotalAssets = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]);

  const handleSelectWallet = (wallet) => {
    setSelectedWallet(wallet);
    setIsOpen(false);
  };

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
                key={wallet.name}
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

const Activity = () => (
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
          <p className="text-white text-2xl font-bold">0 <span className="text-base font-normal text-gray-500">Trades</span></p>
        </div>
      </div>
      <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl flex items-center shadow-lg hover:bg-gray-800 transition-colors duration-300">
        <div className="bg-green-600 p-3 rounded-full">
          <FiCheckCircle className="text-white" size={24} />
        </div>
        <div className="ml-4">
          <p className="text-gray-400 text-sm">Completed Trades</p>
          <p className="text-white text-2xl font-bold">0 <span className="text-base font-normal text-gray-500">Trades</span></p>
        </div>
      </div>
    </div>
  </div>
);

const YourTrades = () => (
  <div className="bg-gray-900 border border-gray-700 p-6 mt-6 rounded-xl shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-200">Your Trades</h3>
      <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center">
        See all <FiArrowRight className="ml-2" />
      </a>
    </div>
    <div className="text-center py-10 border-t border-gray-700">
      <FiGitCommit className="text-gray-600 mx-auto" size={48} />
      <p className="text-gray-500 mt-4">No trade data available.</p>
    </div>
  </div>
);

const RecentTransactions = () => (
    <div className="bg-gray-900 border border-gray-700 p-6 mt-6 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">Recent Transactions</h3>
        <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium">See all</a>
      </div>
      <div className="space-y-4">
        <TransactionItem status="Processing" refId="TXNJ52PDKC9" date="09/10/2025, 10:04 PM" value="121.00 EGLD" type="Credit" />
        <TransactionItem status="Processing" refId="TXNQSJRDWKH" date="09/10/2025, 09:48 PM" value="100.00 AXS" type="Credit" />
        <TransactionItem status="Processing" refId="TXNCC1UZCRY" date="09/10/2025, 09:48 PM" value="100.00 OCTA" type="Credit" />
        <TransactionItem status="Declined" refId="TXNYSPAGBAQ" date="05/10/2025, 12:17 PM" value="100.00 BTC" type="Credit" />
      </div>
    </div>
  );
  
  const TransactionItem = ({ status, refId, date, value, type }) => {
    const statusClasses = {
      Processing: 'bg-yellow-500 text-black',
      Declined: 'bg-red-500 text-white',
    };
  
    return (
      <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between hover:bg-gray-700 transition-colors duration-300">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-4 ${status === 'Processing' ? 'bg-yellow-400' : 'bg-red-500'}`}></div>
          <div>
            <p className="text-white font-semibold">{refId}</p>
            <p className="text-gray-400 text-sm">{date}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white font-bold">{value}</p>
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
