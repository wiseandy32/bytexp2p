'use client';

import { useState } from 'react';

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'User', createdAt: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Admin', createdAt: '2023-02-20' },
    { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com', role: 'User', createdAt: '2023-03-10' },
  ]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Users</h2>
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400">
              <th className="pb-4">Name</th>
              <th className="pb-4">Email</th>
              <th className="pb-4">Role</th>
              <th className="pb-4">Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-200 dark:border-gray-600">
                <td className="py-4">{user.name}</td>
                <td className="py-4">{user.email}</td>
                <td className="py-4">{user.role}</td>
                <td className="py-4">{user.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
