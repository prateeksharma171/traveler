'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();

  return (
    <main className='min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-950 px-6'>
      <div className='text-center'>
        <h1 className='text-9xl font-extrabold text-gray-300 dark:text-gray-700'>
          404
        </h1>
        <h2 className='mt-4 text-4xl font-bold text-gray-800 dark:text-white'>
          Page Not Found
        </h2>
        <p className='mt-2 text-lg text-gray-600 dark:text-gray-400'>
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </p>

        <div
          className='mt-6 inline-flex items-center gap-2 cursor-pointer text-white bg-[#618cab] dark:bg-[#618cab] dark:text-black hover:opacity-90 px-6 py-3 rounded-xl transition'
          onClick={() => router.push('/traveler/trips')}
        >
          <ArrowLeft className='w-5 h-5' />
          Go back home
        </div>
      </div>
    </main>
  );
};

export default NotFound;
