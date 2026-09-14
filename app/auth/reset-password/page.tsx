"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ResetPasswordContent() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleResend = async () => {
    if (!email) {
      setError("Enter your email address first so we can resend the code.");
      return;
    }
    setResending(true);
    setError("");
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to resend code");
      } else {
        setError("");
        setSuccess("A new reset code has been sent to your email.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess(data.message);
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h4 className="text-2xl font-serif mb-2">Reset Password</h4>
      <p className="text-gray-400 text-sm mb-6">
        Enter the code sent to your email, then choose a new password.
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
        <div className="mb-4 relative">
          <input
            type="text"
            name="code"
            id="id_code"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer"
            placeholder=" "
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <label
            htmlFor="id_code"
            className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all"
          >
            Reset code
          </label>
        </div>
        <div className="mb-4 relative">
          <input
            type="password"
            name="newPassword"
            id="id_new_password"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer"
            placeholder=" "
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label
            htmlFor="id_new_password"
            className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all"
          >
            New password
          </label>
        </div>
        <div className="mb-6 relative">
          <input
            type="password"
            name="confirmPassword"
            id="id_confirm_password"
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:border-green-500 peer"
            placeholder=" "
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <label
            htmlFor="id_confirm_password"
            className="absolute left-3 -top-2.5 text-gray-400 text-xs bg-dark-bg5 px-1 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs transition-all"
          >
            Confirm new password
          </label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <button
          type="submit"
          className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-400">
          Didn&apos;t get a code?{" "}
          <button
            type="button"
            onClick={handleResend}
            className="text-green-500 hover:underline"
            disabled={resending}
          >
            {resending ? "Resending..." : "Resend code"}
          </button>
        </p>
        <p className="text-gray-400 mt-2">
          <Link href="/auth/login" className="text-green-500 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </>
  );
}

export default function ResetPassword() {
  return (
    <Suspense
      fallback={<div className="text-center p-4">Loading reset form...</div>}
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
