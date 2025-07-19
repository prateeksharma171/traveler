'use client';

import { signIn } from 'next-auth/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaGithub, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ImSpinner2 } from 'react-icons/im';
import { Input } from '@/components/ui/input';
import { signUp } from '@/app/api/system/signup';

const SignUpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<
    'none' | 'signup' | 'google' | 'github'
  >('none');

  useEffect(() => {
    if (error === 'OAuthAccountNotLinked') {
      toast.error(
        'An account already exists with this email. Please sign in using the originally used provider.'
      );
    }
  }, [error]);

  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is Required'),
    email: Yup.string().email('Invalid email').required('Email is Required'),
    password: Yup.string()
      .min(6, 'Minimum 6 characters')
      .required('Password is Required'),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading('signup');
    try {
      const res = await signUp(values);
      const { status, error } = res;

      if (status !== 201) {
        toast.error(error || 'Signup failed!');
        return;
      }

      toast.success('Signed up successfully!');
      router.replace('/signin');
    } catch (err) {
      toast.error('Something went wrong!',err!);
    } finally {
      setLoading('none');
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className='space-y-6'>
        <div>
          <Field
            as={Input}
            name='name'
            type='text'
            placeholder='Full Name'
            className='bg-gray-800/50 border-gray-700 text-white placeholder-gray-400'
          />
          <ErrorMessage
            name='name'
            component='div'
            className='text-red-400 text-sm mt-1'
          />
        </div>

        <div>
          <Field
            as={Input}
            name='email'
            type='email'
            placeholder='Email'
            className='bg-gray-800/50 border-gray-700 text-white placeholder-gray-400'
          />
          <ErrorMessage
            name='email'
            component='div'
            className='text-red-400 text-sm mt-1'
          />
        </div>

        <div className='relative'>
          <Field
            as={Input}
            name='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            className='bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 pr-12'
          />
          <button
            type='button'
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300'
          >
            {showPassword ? (
              <FaEyeSlash className='w-5 h-5' />
            ) : (
              <FaEye className='w-5 h-5' />
            )}
          </button>
          <ErrorMessage
            name='password'
            component='div'
            className='text-red-400 text-sm mt-1'
          />
        </div>

        <Button
          type='submit'
          disabled={loading !== 'none'}
          className='w-full bg-[#5f8cab] hover:bg-[#abc3d3] text-white py-3 rounded-lg flex items-center justify-center'
        >
          {loading === 'signup' && (
            <ImSpinner2 className='animate-spin mr-2 inline-block' />
          )}
          Sign Up
        </Button>

        {/* Social Buttons */}
        <div className='mt-6'>
          <div className='text-center mb-4 text-gray-400 text-sm'>
            Or sign up with
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Button
              onClick={() => {
                setLoading('google');
                signIn('google', { callbackUrl: '/traveler/trips' })
                  .catch(() => toast.error('Google sign-up failed'))
                  .finally(() => setLoading('none'));
              }}
              disabled={loading !== 'none'}
              variant='outline'
              className='bg-gray-800/50 text-white'
            >
              {loading === 'google' ? (
                <ImSpinner2 className='animate-spin w-5 h-5' />
              ) : (
                <FaGoogle className='w-5 h-5' />
              )}
              Google
            </Button>
            <Button
              onClick={() => {
                setLoading('github');
                signIn('github', { callbackUrl: '/traveler/trips' })
                  .catch(() => toast.error('GitHub sign-up failed'))
                  .finally(() => setLoading('none'));
              }}
              disabled={loading !== 'none'}
              variant='outline'
              className='bg-gray-800/50 text-white'
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
      </Form>
    </Formik>
  );
};

export default SignUpForm;
