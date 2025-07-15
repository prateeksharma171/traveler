'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import NavBar from '@/components/global/NavBar';
import Link from 'next/link';

const HomePage = () => {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.replace('/traveler/trips');
    }
  }, [session, router])

  return (
    <>
      <NavBar />
      <main className='min-h-screen bg-[#f5f9fc] text-gray-800'>
        {/* Hero Section */}
        <section className='bg-[#608aa8] text-white py-20 px-6 text-center'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-4xl md:text-6xl font-bold mb-6'>
              Explore the World with Us
            </h1>
            <p className='text-lg md:text-2xl mb-8'>
              Your journey begins here. Discover new places, cultures, and
              adventures.
            </p>
            <Link
              href='/traveler/trips'
              className='inline-block bg-white text-[#608aa8] font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition'
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className='py-16 px-6 mb-24'>
          <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center'>
            <div className='cursor-pointer'>
              <img
                src={'/travel1.jpg'}
                alt='Explore'
                className='w-full h-full object-cover object-center mx-auto mb-4 rounded-xl shadow'
              />
              <h3 className='text-xl font-semibold mb-2'>
                Explore Destinations
              </h3>
              <p>
                Discover the most breathtaking destinations around the globe.
              </p>
            </div>
            <div className='cursor-pointer'>
              <img
                src={'/travel2.jpg'}
                alt='Plan'
                className='w-full h-full object-cover object-center mx-auto mb-4 rounded-xl shadow'
              />
              <h3 className='text-xl font-semibold mb-2'>Plan Your Trip</h3>
              <p>
                Custom itineraries, travel tips, and seamless planning tools.
              </p>
            </div>
            <div className='cursor-pointer'>
              <img
                src={'/travel3.jpg'}
                alt='Enjoy'
                className='w-full h-full object-cover object-center mx-auto mb-4 rounded-xl shadow'
              />
              <h3 className='text-xl font-semibold mb-2'>Enjoy the Journey</h3>
              <p>
                Relax and enjoy your adventure with peace of mind and support.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className='bg-[#608aa8] text-white text-center py-6'>
          <p>
            &copy; {new Date().getFullYear()} TravelMate. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  );
};

export default HomePage;
