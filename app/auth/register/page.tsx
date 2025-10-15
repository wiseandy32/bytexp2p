'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: fullName });

            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: fullName,
                email: user.email,
                isAdmin: false,
                isDeleted: false,
                isVerified: false,
            });

            await signOut(auth);
            router.push('/auth/login');
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h4 className="text-2xl font-serif mb-2">Create Account</h4>
            <p className="text-gray-400 text-sm mb-6">Start exchanging crypto assets today. Secure & fast crypto escrow protocol.</p>
            
            <form onSubmit={handleRegister}>
                <div className="mb-4 relative">
                    <input 
                        type="text" 
                        name="fullName" 
                        id="fullName" 
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer" 
                        placeholder=" " 
                        required 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                    <label htmlFor="fullName" className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all">Full Name</label>
                </div>
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
                <div className="mb-4 relative">
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
                <div className="mb-6 relative">
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        id="id_confirm_password" 
                        className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer" 
                        placeholder=" " 
                        required 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <label htmlFor="id_confirm_password" className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all">Confirm password</label>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <button type="submit" className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>

            <div className="text-center mt-6">
                <p className="text-gray-400">Already have an account? <Link href="/auth/login" className="text-green-500 hover:underline">Login</Link></p>
            </div>
        </>
    );
}