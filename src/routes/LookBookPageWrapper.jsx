import { Suspense, lazy } from 'react';
import Fallback from '@/pages/Fallback';

const LookbookPage = lazy(() => import('@/pages/LookBookPage'));

const LookbookPageWrapper = () => (
  <Suspense fallback={<Fallback />}>
    <LookbookPage />
  </Suspense>
);

export default LookbookPageWrapper;
