'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid verification code');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="text-2xl font-serif mb-2">Verify Your Email</h4>
      <p className="text-gray-400 text-sm mb-6">Enter the verification code sent to your email address.</p>
      
      <form onSubmit={handleVerify}>
        <div className="mb-4 relative">
          <input 
            type="text" 
            name="code" 
            id="code" 
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer" 
            placeholder=" " 
            required 
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <label htmlFor="code" className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all">Verification Code</label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button type="submit" className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </>
  );
}
