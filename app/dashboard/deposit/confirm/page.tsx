'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import Image from 'next/image';

export default function ConfirmDepositPage() {
  const searchParams = useSearchParams();
  const token = JSON.parse(searchParams.get('token'));
  const amount = searchParams.get('amount');

  const [txHash, setTxHash] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log('Submitting:', { txHash, proofImage, token, amount });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-5 mt-4">
          <Image src="https://peershieldex.com/assets/images/icon-convert.svg" alt="" width={40} height={40} />
          <span style={{ fontSize: '20px' }} className="top-2 font-bold">Confirm Deposit</span>
          <small className="text-xs text-gray-400 block mt-2">
            Please upload a screenshot of the transaction receipt OR give the transaction hash as evidence that the payment was successful.
          </small>
        </div>
        <div className="bg-gray-800 rounded-md p-4">
          <h5 className="mb-3 text-white">Transaction ID: #TXNPSTWO2QU</h5>
          <form onSubmit={handleSubmit}>
            <div className="p-lg-4">
              <div className="relative mt-2">
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  className="w-full bg-gray-700 border-none rounded-md py-2 px-3 text-white focus:outline-none"
                  placeholder="Paste TxnHash"
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="pop"
                  className="bg-gray-700 text-center cursor-pointer text-xs w-full py-2 px-4 rounded-md flex items-center justify-center"
                >
                  <FiUpload className="mr-2" />
                  Upload a proof of payment
                </label>
                <input
                  type="file"
                  id="pop"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
                <small className="text-xs d-block text-gray-500 mt-1">Maximum file size : 2MB</small>
              </div>
              {previewUrl && (
                <div className="mt-4">
                  <Image src={previewUrl} alt="Proof of payment" width={120} height={120} />
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-700">
              <button type="submit" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-bold text-xs">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
