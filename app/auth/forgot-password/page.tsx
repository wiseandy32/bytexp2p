"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        // Move to the reset step with the email pre-filled.
        setTimeout(() => {
          router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
        }, 1200);
      } else {
        setError(data.error || "Failed to send reset code");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="text-2xl font-serif mb-2">Forgot Password</h4>
      <p className="text-gray-400 text-sm mb-6">
        Enter your account email and we&apos;ll send you a code to reset your
        password.
      </p>

      <form onSubmit={handleSubmit}>
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
          <label
            htmlFor="id_email"
            className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all"
          >
            Email address
          </label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <button
          type="submit"
          className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Code"}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-400">
          Remember your password?{" "}
          <Link href="/auth/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </>
  );
}
