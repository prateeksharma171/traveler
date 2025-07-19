'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { addLocation } from '@/app/api/system/trip';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ImSpinner2 } from 'react-icons/im';

const NewItineraryLocation = ({ tripId }: { tripId: string }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const initialValues = {
    address: '',
  };

  const validationSchema = Yup.object({
    address: Yup.string().required('Address is required'),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    toast.dismiss();
    setLoading(true);
    const res = await addLocation(tripId, values.address);
    if (res?.status === 200) {
      toast.success('Location added!');
      router.push(`/traveler/trips/${tripId}`);
    } else {
      toast.error(res?.error || 'Something went wrong.');
    }
    setLoading(false);
  };

  return (
    <div className='min-h-[calc(100vh-8rem)] flex items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md mx-auto'>
        <div className='bg-white p-8 shadow-lg rounded-lg'>
          <h1 className='text-3xl font-bold text-center mb-6'>
            Add new location
          </h1>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className='space-y-4'>
              <div>
                <Field
                  as={Input}
                  id='address'
                  name='address'
                  type='text'
                  placeholder='Enter address'
                  className='border-gray-300 focus:ring-[#5f8cab] focus:border-[#5f8cab]'
                />
                <ErrorMessage
                  name='address'
                  component='div'
                  className='text-red-500 text-sm mt-1'
                />
              </div>

              <Button
                type='submit'
                disabled={loading}
                className='w-full bg-[#5f8cab] text-white py-2 px-4 rounded-md hover:bg-[#8aabc2] cursor-pointer flex items-center justify-center'
              >
                {loading ? <ImSpinner2 className='animate-spin mr-2' /> : null}
                {loading ? 'Adding...' : 'Add Location'}
              </Button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default NewItineraryLocation;
