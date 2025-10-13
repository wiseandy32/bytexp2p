import { Suspense } from 'react';
import DepositAddress from '@/components/DepositAddress';

export default function DepositAddressPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DepositAddress />
    </Suspense>
  );
}
