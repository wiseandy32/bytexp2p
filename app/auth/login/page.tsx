'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showVerificationLink, setShowVerificationLink] = useState(false);
    const [uidForVerification, setUidForVerification] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setShowVerificationLink(false);
        setUidForVerification(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();

                if (!userData.isVerified) {
                    setError("Please verify your email before logging in.");
                    setShowVerificationLink(true);
                    setUidForVerification(user.uid);
                    setLoading(false);
                    return;
                }

                if (userData.isAdmin) {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard');
                }
            } else {
                setError("User data not found. Please contact support.");
            }
        } catch (error: any) {
            setError("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h4 className="text-2xl font-serif mb-2">Login to your Account</h4>
            <p className="text-gray-400 text-sm mb-6">Start exchanging crypto assets today. Secure & fast crypto escrow protocol.</p>
            
            <form onSubmit={handleLogin}>
                <div className="mb-4 relative">
                    <input 
                        type="email" 
                        name="email" 
                        id="id_email" 
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer" 
                        placeholder=" " 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="id_email" className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all">Email address</label>
                </div>
                <div className="mb-6 relative">
                    <input 
                        type="password" 
                        name="password" 
                        id="id_password" 
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer" 
                        placeholder=" " 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="id_password" className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all">Password</label>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                {showVerificationLink && uidForVerification && (
                    <div className="text-center mb-4">
                        <Link href={`/auth/verify-email?uid=${uidForVerification}&email=${email}`} className="text-green-500 hover:underline">
                            Verify Email
                        </Link>
                    </div>
                )}

                <button type="submit" className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600" disabled={loading}>
                    {loading ? 'Authenticating...' : 'Login'}
                </button>
            </form>

            <div className="text-center mt-6">
                <p className="text-gray-400">Don't have an account? <Link href="/auth/register" className="text-green-500 hover:underline">Register</Link></p>
            </div>
        </>
    );
}
