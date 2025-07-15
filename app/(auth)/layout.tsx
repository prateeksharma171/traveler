import { Toaster } from 'react-hot-toast';

// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster position='bottom-center' />
    </>
  );
}
