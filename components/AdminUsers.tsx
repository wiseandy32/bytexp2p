'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FiMoreVertical } from 'react-icons/fi';
import { toast } from 'sonner';

interface User {
  id: string;
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
  displayName?: string;
  isAdmin?: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          name: data.displayName || 'N/A',
          role: data.isAdmin ? 'admin' : 'user',
        };
      }) as User[];
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  };

  const handleMakeAdmin = async (userId: string) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, isAdmin: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to make admin');
      }
      
      toast.success("User promoted to admin successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error making user admin: ", error);
      toast.error("Error making user admin: " + (error as Error).message);
    }
  };

  const handleDemoteToUser = async (userId: string) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("Not authenticated");

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, isAdmin: false }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to demote user');
      }

      toast.success("User demoted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error demoting user: ", error);
      toast.error("Error demoting user: " + (error as Error).message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        const token = await getAuthToken();
        if (!token) throw new Error("Not authenticated");

        const response = await fetch('/api/admin/users', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId: userToDelete }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete user');
        }

        toast.success("User deleted successfully");
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user: ", error);
        toast.error("Error deleting user: " + (error as Error).message);
      }
    }
    setShowDeleteConfirmation(false);
    setUserToDelete(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent style={{ overflowY: 'visible' }}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Email Address</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{user.email || 'N/A'}</TableCell>
                  <TableCell>{user.name || 'N/A'}</TableCell>
                  <TableCell>{user.role || 'user'}</TableCell>
                  <TableCell className="relative">
                    <button onClick={() => setOpenActionMenu(openActionMenu === user.id ? null : user.id)} className="text-gray-500 hover:text-gray-700">
                      <FiMoreVertical size={20} />
                    </button>
                    {openActionMenu === user.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700">
                        <div className="py-1">
                          <div className="px-4 py-2 text-xs text-gray-400">Actions</div>
                          {user.role !== 'admin' ? (
                            <button onClick={() => { handleMakeAdmin(user.id); setOpenActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                              Make Admin
                            </button>
                          ) : (
                            <button onClick={() => { handleDemoteToUser(user.id); setOpenActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                              Demote to User
                            </button>
                          )}
                          <button onClick={() => { handleDeleteUser(user.id); setOpenActionMenu(null); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
