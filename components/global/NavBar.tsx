'use client';

import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { navLinks } from '@/utils/constant';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const NavBar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className=' bg-white shadow-md py-4 border-b border-gray-200'>
      <div className='container mx-auto flex justify-between items-center px-6 lg:px-8'>
        <Link
          href={'/'}
          className='flex items-center space-x-3'
          aria-label='Home'
        >
          <Image
            src={'/logo.png'}
            alt='Logo'
            width={50}
            height={50}
            priority
            className='bg-transparent'
          />
          <span className=' text-2xl font-bold text-gray-800'>Traveler</span>
        </Link>

        <div className=' flex items-center space-x-4'>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className='text-slate-900 hover:text-sky-500'
            >
              {link.name}
            </Link>
          ))}

          {session && (
            <Button
              onClick={() => signOut()}
              className='bg-red-500 hover:bg-red-500 text-white px-4 py-2 rounded cursor-pointer'
            >
              Sign out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
