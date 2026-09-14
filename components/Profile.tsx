"use client";

import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/lib/firebase";
import { FiInfo, FiLock, FiUser } from "react-icons/fi";

interface UserProfileData {
  displayName?: string;
  email?: string;
  uid?: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setProfile(snap.data() as UserProfileData);
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const displayName = profile?.displayName || user?.displayName || "N/A";
  const email = profile?.email || user?.email || "N/A";

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!user || !user.email) {
      setFormError("No authenticated user found. Please log in again.");
      return;
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormError("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 6) {
      setFormError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("New passwords do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setFormError("New password must be different from the current password.");
      return;
    }

    setChanging(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setFormSuccess("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      const code =
        typeof error === "object" && error !== null && "code" in error
          ? String((error as { code: unknown }).code)
          : "";
      if (
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential" ||
        code === "auth/invalid-login-credentials"
      ) {
        setFormError("Current password is incorrect.");
      } else if (code === "auth/weak-password") {
        setFormError("New password is too weak. Use at least 6 characters.");
      } else if (code === "auth/requires-recent-login") {
        setFormError("Session expired. Please log out and log in again.");
      } else if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Failed to change password. Please try again.");
      }
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="lg:px-5 mt-4 text-white">
      <div className="bg-gray-900 pb-4">
        <div className="flex border-b border-gray-700 p-3">
          <p className="m-0 text-sm font-bold">Profile</p>
        </div>

        {/* Step 1 */}
        <div className="px-3 pb-3 mt-4">
          <div className="flex items-center mb-2">
            <span className="font-sans py-1 px-2 text-xs w-fit bg-gray-700 text-blue-400 rounded">
              1
            </span>
            <p className="m-0 ml-4 text-sm">Account Details</p>
          </div>
          <div className="pl-10 mt-2 flex flex-col gap-3">
            {profileLoading ? (
              <p className="text-gray-400 text-sm">Loading…</p>
            ) : (
              <>
                <div className="p-3 bg-gray-800 rounded-md flex items-center">
                  <FiUser className="text-blue-400 mr-3 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="m-0 text-xs text-gray-400">Full Name</p>
                    <p className="m-0 font-bold">{displayName}</p>
                  </div>
                </div>
                <div className="p-3 bg-gray-800 rounded-md flex items-center">
                  <FiInfo className="text-blue-400 mr-3 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="m-0 text-xs text-gray-400">Email Address</p>
                    <p className="m-0 font-bold break-all">{email}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Step 2 */}
        <div className="px-3 pb-3 mt-2">
          <div className="flex items-center mb-2">
            <span className="font-sans py-1 px-2 text-xs w-fit bg-gray-700 text-blue-400 rounded">
              2
            </span>
            <p className="m-0 ml-4 text-sm">Change Password</p>
          </div>
          <div className="pl-10 mt-2">
            <form
              onSubmit={handlePasswordChange}
              className="flex flex-col gap-3"
            >
              <div className="p-3 bg-gray-800 rounded-md flex items-center">
                <FiLock className="text-blue-400 mr-3 flex-shrink-0" />
                <input
                  id="current-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-transparent w-full font-bold border-none focus:outline-none placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                  placeholder="Current password"
                />
              </div>
              <div className="p-3 bg-gray-800 rounded-md flex items-center">
                <FiLock className="text-blue-400 mr-3 flex-shrink-0" />
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-transparent w-full font-bold border-none focus:outline-none placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                  placeholder="New password (min. 6 characters)"
                />
              </div>
              <div className="p-3 bg-gray-800 rounded-md flex items-center">
                <FiLock className="text-blue-400 mr-3 flex-shrink-0" />
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent w-full font-bold border-none focus:outline-none placeholder:text-gray-500 placeholder:font-normal placeholder:text-sm"
                  placeholder="Confirm new password"
                />
              </div>

              {formError && (
                <small className="text-red-500 text-xs mt-1" role="alert">
                  {formError}
                </small>
              )}
              {formSuccess && (
                <small className="text-green-500 text-xs mt-1" role="status">
                  {formSuccess}
                </small>
              )}

              <button
                className="mt-1 py-2 text-sm w-fit px-4 bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-60"
                type="submit"
                disabled={changing}
              >
                {changing ? "Changing password…" : "Change password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
