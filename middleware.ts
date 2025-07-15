import { withAuth } from 'next-auth/middleware';
import { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req: NextRequest) {
  },
  {
    pages: {
      signIn: '/signin'
    },
    callbacks: {
      authorized: ({ token }) => {
        // You can add custom logic here like role-based access
        return !!token; // Only allow access if token exists
      },
    },
  }
);

export const config = {
  matcher: ['/traveler/:path*'],
};
