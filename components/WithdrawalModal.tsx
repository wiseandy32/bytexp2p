"use client";

import { fetchTokens, Token } from "@/lib/data";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import TokenModal from "./TokenModal";
import { FiChevronDown } from "react-icons/fi";

type WithdrawalModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WithdrawalModal({
  isOpen,
  onClose,
}: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [selectedToken, setSelectedToken] = useState<Token | null | undefined>(
    null
  );
  const [allTokens, setAllTokens] = useState<Token[]>([]);

  useEffect(() => {
    const getTokens = async () => {
      const fetchedTokens = await fetchTokens();
      setAllTokens(fetchedTokens);
    };
    getTokens();
  }, []);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Withdrawal request:", { selectedToken, amount, address });
    // here you would add the logic to handle the withdrawal
    toast.success("Withdrawal request submitted");
    onClose();
  };

  console.log(allTokens);

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] z-50 flex justify-center items-center">
      <div className="bg-gray-800 rounded-lg shadow-xl m-4 max-w-md w-full">
        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
          <p className="m-0 font-bold text-white">Request Withdrawal</p>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-3">
          <form onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="_token"
              value="LezWTWg3oR0pi2dex0oDeDpZ4G9NGtLoecM0oo33"
            />
            <div className="mb-4">
              <label
                className="block text-gray-400 text-sm mb-2"
                htmlFor="currency_id"
              >
                Select withdrawal method
              </label>
              <select
                id="currency_id"
                name="currency_id"
                value={selectedToken?.shortName || ""}
                onChange={(e) =>
                  setSelectedToken(
                    allTokens?.find(
                      (token) => token.shortName === e.target.value
                    )
                  )
                }
                className="w-full bg-gray-700 border-none rounded-md py-2 px-3 text-white focus:outline-none"
              >
                {allTokens.map((token) => (
                  <option key={token.depositAddress} value={token.shortName}>
                    {token.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-400 text-sm mb-2"
                htmlFor="amount"
              >
                Enter Amount
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-700 border-none rounded-md py-2 px-3 text-white focus:outline-none"
                placeholder="0.00"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-400 text-sm mb-2"
                htmlFor="address"
              >
                Destination Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-gray-700 border-none rounded-md py-2 px-3 text-white focus:outline-none"
                placeholder="Enter destination address"
                required
              />
            </div>
            <p className="text-gray-500 text-xs">
              Note: Ensure that the address is correct and on the same network.
              Contact{" "}
              <a
                href="mailto:support@Bytexp2p.com"
                className="text-blue-400 hover:underline"
              >
                support@Bytexp2p.com
              </a>{" "}
              for guidance.
            </p>
            <div className="mt-4 text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md text-xs"
              >
                Proceed
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
