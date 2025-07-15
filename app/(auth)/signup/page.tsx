'use client';

import { signIn } from 'next-auth/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ImSpinner2 } from 'react-icons/im';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signUp } from '@/app/api/system/signup';

const SignIn = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<
    'none' | 'signup' | 'google' | 'github'
  >('none');
  const initialValues = {
    name: '',
    email: '',
    password: '',
    remember: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is Required'),
    email: Yup.string().email('Invalid email').required('Email is Required'),
    password: Yup.string()
      .min(6, 'Minimum 6 characters')
      .required('Password is Required'),
  });

  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessage =
    error === 'OAuthAccountNotLinked'
      ? 'An account already exists with this email. Please sign in using the originally used provider.'
      : null;
  const handleSubmit = async (values: typeof initialValues) => {
    setLoading('signup');
    try {
      const res = await signUp(values);
      const { status, error, message } = res;

      if (status !== 201) {
        toast.error(error || 'Signup failed!');
        return;
      }

      toast.success('Signed up successfully!');
      router.replace('/signin');
    } catch (err) {
      console.error('Signup error:', err);
      toast.error('Something went wrong!');
    } finally {
      setLoading('none');
    }
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
    }
  }, [errorMessage]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-6'>
      <div className='w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl'>
        <h2 className='text-3xl font-bold mb-6 text-center text-primary'>
          Create your account
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className='space-y-4'>
            <div>
              <label className='block text-gray-700'>Name</label>
              <Field
                name='name'
                className='w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
              />
              <ErrorMessage
                name='name'
                component='div'
                className='text-sm text-red-500'
              />
            </div>

            <div>
              <label className='block text-gray-700'>Email</label>
              <Field
                type='email'
                name='email'
                className='w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
              />
              <ErrorMessage
                name='email'
                component='div'
                className='text-sm text-red-500'
              />
            </div>

            <div className='relative'>
              <label className='block text-gray-700'>Password</label>

              <Field
                type={showPassword ? 'text' : 'password'}
                name='password'
                className='w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10'
              />

              <div
                className='absolute right-3 top-[38px] cursor-pointer text-gray-500'
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </div>

              <ErrorMessage
                name='password'
                component='div'
                className='text-sm text-red-500 mt-1'
              />
            </div>

            <Button
              type='submit'
              disabled={loading !== 'none'}
              className='w-full bg-[#618cab] hover:bg-[#a7bbd8] text-white py-2 rounded-lg font-semibold transition cursor-pointer'
            >
              {loading === 'signup' ? (
                <ImSpinner2 className='animate-spin mr-2 inline-block' />
              ) : null}
              Sign Up
            </Button>

            <p
              onClick={() => router.push('/signin')}
              className='text-sm text-blue-600 hover:underline hover:text-blue-800 font-medium cursor-pointer text-center'
            >
              Already have an account?
            </p>
          </Form>
        </Formik>

        <div className='mt-6'>
          <p className='text-center text-sm text-gray-500 mb-3'>
            or sign up with
          </p>

          <div className='flex flex-col space-y-3'>
            <Button
              onClick={async () => {
                setLoading('google');
                try {
                  await signIn('google', { callbackUrl: '/traveler/trips' });
                } catch (err) {
                  toast.error('Google sign-in failed');
                  setLoading('none');
                }
              }}
              disabled={loading !== 'none'}
              className='w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg bg-white text-black hover:bg-gray-200 hover:text-black transition cursor-pointer'
            >
              {loading === 'google' ? (
                <ImSpinner2 className='animate-spin w-5 h-5' />
              ) : (
                <FaGoogle className='w-5 h-5' />
              )}
              Google
            </Button>

            <Button
              onClick={async () => {
                setLoading('github');
                try {
                  await signIn('github', { callbackUrl: '/traveler/trips' });
                } catch (err) {
                  toast.error('GitHub sign-in failed');
                  setLoading('none');
                }
              }}
              disabled={loading !== 'none'}
              className='w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg bg-white text-black hover:bg-gray-200 hover:text-black transition cursor-pointer'
            >
              {loading === 'github' ? (
                <ImSpinner2 className='animate-spin w-5 h-5' />
              ) : (
                <FaGithub className='w-5 h-5' />
              )}
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
