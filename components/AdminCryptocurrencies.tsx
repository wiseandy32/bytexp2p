"use client";

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Cryptocurrency {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  depositAddress: string;
}

export default function AdminCryptocurrencies() {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>(
    [],
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "cryptocurrencies"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cryptoData: Cryptocurrency[] = [];
      snapshot.forEach((doc) => {
        cryptoData.push({ id: doc.id, ...doc.data() } as Cryptocurrency);
      });
      setCryptocurrencies(cryptoData);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "cryptocurrencies", id));
      toast.success("Cryptocurrency deleted successfully");
    } catch (error) {
      console.error("Error deleting cryptocurrency: ", error);
      toast.error("Failed to delete cryptocurrency");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">All Cryptocurrencies</h2>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400">
                <th className="px-6 py-3 whitespace-nowrap">S/N</th>
                <th className="px-6 py-3 whitespace-nowrap">Logo</th>
                <th className="px-6 py-3 whitespace-nowrap">Name</th>
                <th className="px-6 py-3 whitespace-nowrap">Symbol</th>
                <th className="px-6 py-3 whitespace-nowrap">Deposit Address</th>
                <th className="px-6 py-3 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {cryptocurrencies.map((crypto, index) => (
                <tr
                  key={crypto.id}
                  className="border-t border-gray-200 dark:border-gray-600"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={crypto.logoUrl}
                      alt={crypto.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{crypto.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {crypto.shortName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {crypto.depositAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                    <Link
                      href={`/admin/cryptocurrencies/edit/${crypto.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-red-500 hover:underline">
                          Delete
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the cryptocurrency from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(crypto.id)}
                            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
