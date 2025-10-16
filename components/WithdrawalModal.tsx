"use client";

import { useState, useEffect } from "react";

const tokens = [
  { value: "1", name: "AXS" },
  { value: "264", name: "OCTA" },
  { value: "267", name: "EGLD" },
  { value: "248", name: "DAR" },
  { value: "259", name: "WOLF" },
  { value: "266", name: "AAVE" },
  { value: "265", name: "WAFFLES" },
  { value: "247", name: "HOT" },
  { value: "263", name: "TRIO" },
  { value: "262", name: "EAR" },
  { value: "261", name: "DATA" },
  { value: "260", name: "RCH" },
  { value: "258", name: "ENA" },
  { value: "249", name: "CPH" },
  { value: "257", name: "ANKR" },
  { value: "268", name: "AEVO" },
  { value: "255", name: "ALI" },
];

export default function WithdrawalModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [selectedToken, setSelectedToken] = useState(tokens[0].value);

  useEffect(() => {
    const handleEsc = (event) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Withdrawal request:", { selectedToken, amount, address });
    // here you would add the logic to handle the withdrawal
    onClose();
  };

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
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full bg-gray-700 border-none rounded-md py-2 px-3 text-white focus:outline-none"
              >
                {tokens.map((token) => (
                  <option key={token.value} value={token.value}>
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
