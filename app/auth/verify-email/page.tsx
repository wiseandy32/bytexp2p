import { Suspense } from 'react';
import VerifyEmailComponent from './VerifyEmailComponent';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailComponent />
    </Suspense>
  );
}
