'use client';

import EditCryptocurrencyForm from '@/components/EditCryptocurrencyForm';

export default function EditCryptocurrencyPage({ params }: { params: { id: string } }) {

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Edit Cryptocurrency</h2>
      <EditCryptocurrencyForm cryptocurrencyId={params.id} />
    </div>
  );
}
