import { Suspense } from 'react';
import ConfirmDeposit from '@/components/ConfirmDeposit';

export default function ConfirmDepositPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmDeposit />
    </Suspense>
  );
}
