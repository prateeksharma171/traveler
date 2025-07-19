'use client';

import { signIn } from 'next-auth/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaGithub, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ImSpinner2 } from 'react-icons/im';

const SignInForm = () => {
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
    email: '',
    password: '',
    remember: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is Required'),
    password: Yup.string()
      .min(6, 'Minimum 6 characters')
      .required('Password is Required'),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    toast.dismiss();
    setLoading('signup');
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        remember: values.remember ? 'true' : 'false',
      });

      if (res?.error) {
        toast.error('Invalid email or password');
      } else {
        toast.success('Signed in successfully!');
        router.replace('/traveler/trips');
      }
    } catch (err) {
      toast.error('Something went wrong!');
      console.error('Sign-in error:', err!);
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
      {({ values, setFieldValue }) => (
        <Form className='space-y-6'>
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

          <div className='flex items-center space-x-2'>
            <Checkbox
              id='remember'
              checked={values.remember}
              onCheckedChange={(checked: boolean) =>
                setFieldValue('remember', checked)
              }
              className='border-gray-300 data-[state=checked]:bg-[#5f8cab] data-[state=checked]:border-[#5f8cab]'
            />
            <label htmlFor='remember' className='text-sm text-gray-400'>
              Remember Me
            </label>
          </div>

          <Button
            type='submit'
            disabled={loading !== 'none'}
            className='w-full bg-[#5f8cab] hover:bg-[#abc3d3] text-white py-3 rounded-lg flex items-center justify-center'
          >
            {loading === 'signup' && (
              <ImSpinner2 className='animate-spin mr-2' />
            )}
            Sign In
          </Button>

          <div className='mt-6'>
            <div className='text-center mb-4 text-gray-400 text-sm'>
              Or sign in with
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <Button
                onClick={() => {
                  setLoading('google');
                  signIn('google', { callbackUrl: '/traveler/trips' })
                    .catch(() => toast.error('Google sign-in failed'))
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
                    .catch(() => toast.error('GitHub sign-in failed'))
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
      )}
    </Formik>
  );
};

export default SignInForm;
