import SignInForm from '@/components/SignInForm';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

const SignIn = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#5f8cab] via-gray-700 to-gray-900 flex'>
      <div className='hidden lg:flex lg:w-1/2 relative'>
        <div className='absolute inset-0 bg-gradient-to-br from-[#5f8cab]/90 to-[#5f8cab]/90 z-10'></div>
        <div
          className='w-full h-full bg-cover bg-center relative'
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
          }}
        >
          <div className='absolute inset-0 z-20 p-8 flex flex-col justify-between'>
            <div className='flex items-center justify-between'>
              <h1 className='text-3xl font-bold text-white'>Traveler</h1>
              <Link
                href='/'
                className='text-white/90 hover:text-white flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-white/40 transition-all duration-300'
              >
                <span className='text-sm'>Back to website</span>
                <ArrowRight className='w-4 h-4' />
              </Link>
            </div>
            <div className='text-white'>
              <h2 className='text-5xl font-bold mb-4 leading-tight'>
                Welcome Back,
                <br />
                Let&apos;s Continue
              </h2>
              <div className='flex gap-2 mt-8'>
                <div className='w-8 h-1 bg-white/40 rounded-full'></div>
                <div className='w-8 h-1 bg-white rounded-full'></div>
                <div className='w-8 h-1 bg-white/40 rounded-full'></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign-in Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          <div className='mb-8 text-white'>
            <h1 className='text-3xl font-bold mb-2'>Access your account</h1>
            <p className='text-gray-400'>
              Don&apos;t have an account?{' '}
              <Link
                href='/signup'
                className='text-[#5f8cab] hover:text-[#abc3d3] underline'
              >
                Sign up
              </Link>
            </p>
          </div>
          <Suspense fallback={<div className='text-white'>Loading...</div>}>
            <SignInForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
