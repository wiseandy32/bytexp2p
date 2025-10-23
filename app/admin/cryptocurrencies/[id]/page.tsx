'use client';

import EditCryptocurrencyForm from '@/components/EditCryptocurrencyForm';
import { usePathname } from 'next/navigation';

export default function EditCryptocurrencyPage() {
  const pathname = usePathname();
  const id = pathname.split('/').pop() || '';

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Edit Cryptocurrency</h2>
      <EditCryptocurrencyForm cryptocurrencyId={id} />
    </div>
  );
}
