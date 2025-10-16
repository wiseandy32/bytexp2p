'use client';

import { useState, useEffect } from 'react';
import { fetchTokens, Token } from '@/lib/data';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: Token) => void;
}

export default function TokenModal({ isOpen, onClose, onSelectToken }: TokenModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    if (isOpen) {
      const getTokens = async () => {
        const fetchedTokens = await fetchTokens();
        setTokens(fetchedTokens);
      };
      getTokens();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.shortName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl max-w-sm w-full mx-4">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search by Coin/Token"
              className="bg-transparent text-white w-full focus:outline-none"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
            <button onClick={onClose} className="text-blue-400 font-bold ml-4">Cancel</button>
          </div>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-400 mb-4">Coin/Token List</p>
          <div className="max-h-80 overflow-y-auto">
            {filteredTokens.map(token => (
              <div 
                key={token.id}
                className="flex items-center p-3 hover:bg-gray-700 cursor-pointer rounded-md"
                onClick={() => onSelectToken(token)}
              >
                <img src={token.logoUrl} alt={token.shortName} className="w-5 h-5 mr-3" />
                <p className="font-bold mr-4">{token.shortName}</p>
                <p className="text-gray-400 text-sm capitalize">{token.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
