'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerifyEmail() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('email'); // 'email' or 'code'
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const from = searchParams.get('from');
    const userId = searchParams.get('uid');
    const userEmail = searchParams.get('email');

    if (userId) {
        setUid(userId);
    }

    if (userEmail) {
        setEmail(userEmail);
    }

    if (from === 'register' && userId && userEmail) {
      setView('code');
      handleRequestCode(null, userEmail, userId); // auto-send code on load
    } else {
        setView('email');
    }
  }, [searchParams]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (view === 'code' && !canResend) {
      timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, canResend]);

  const handleRequestCode = async (e: React.FormEvent | null, userEmail = email, userId = uid) => {
    e?.preventDefault();
    if (!userId || !userEmail) {
        setError("User information is missing. Please go back and try again.");
        return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, uid: userId }),
      });

      if (res.ok) {
        setView('code');
        setCanResend(false);
        setResendTimer(60);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to send verification email');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    if (!canResend || !uid || !email) return;
    await handleRequestCode(null, email, uid);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!uid) {
        setError("User session expired or invalid. Please start over.");
        setLoading(false);
        return;
    }

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, code }),
      });

      if (res.ok) {
        const data = await res.json();
        const { user } = data;

        if (user && user.email && user.displayName) {
          // Fire-and-forget call to send welcome email
          fetch('/api/send-welcome-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, name: user.displayName }),
          }).catch(error => {
            // Log error but don't block user
            console.error('Failed to send welcome email:', error);
          });
        }

        router.push('/auth/login');
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
      {view === 'email' ? (
        <>
          <h4 className="text-2xl font-serif mb-2">Verify Your Email</h4>
          <p className="text-gray-400 text-sm mb-6">Enter your email to receive a verification code.</p>
          <form onSubmit={handleRequestCode}>
            <div className="mb-4 relative">
              <input
                type="email"
                name="email"
                id="email"
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer"
                placeholder=" "
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email" className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all">Email Address</label>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button type="submit" className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600" disabled={loading}>
              {loading ? 'Sending...' : 'Request Code'}
            </button>
          </form>
        </>
      ) : (
        <>
          <h4 className="text-2xl font-serif mb-2">Verify Your Email</h4>
          <p className="text-gray-400 text-sm mb-6">Enter the verification code sent to {email}.</p>
          
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

          <div className="text-center mt-4">
            {canResend ? (
              <button
                type="button"
                onClick={handleResendCode}
                className="text-green-500 hover:underline"
                disabled={loading}
              >
                Resend Code
              </button>
            ) : (
              <p className="text-gray-400">
                Resend code in {resendTimer}s
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
}
