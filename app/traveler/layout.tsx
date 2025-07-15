// app/traveler/layout.tsx
import NavBar from '@/components/global/NavBar';
import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function TravelerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      {children}
      <Toaster position='bottom-center' />
    </>
  );
}
