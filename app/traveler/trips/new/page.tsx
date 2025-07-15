'use client';

import { createTrip } from '@/app/api/system/trip';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { ImSpinner2 } from 'react-icons/im';
import { useState } from 'react';

const NewTrip = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const initialValues = {
    tripName: '',
    destination: '',
    startDate: '',
    endDate: '',
  };

  const validationSchema = Yup.object({
    tripName: Yup.string().required('Trip name is required'),
    destination: Yup.string().required('Destination is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required'),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await createTrip({
        ...values,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        userId: session?.user?.id,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.message || 'Trip created!');
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-lg mx-auto mt-10'>
      <Card>
        <CardHeader>New Trip</CardHeader>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className='space-y-4'>
              <div>
                <label htmlFor='tripName' className='block text-gray-700'>
                  Trip Name
                </label>
                <Field
                  id='tripName'
                  name='tripName'
                  placeholder='USA Trip...'
                  className='w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
                <ErrorMessage
                  name='tripName'
                  component='div'
                  className='text-red-500 text-sm'
                />
              </div>

              <div>
                <label htmlFor='destination' className='block text-gray-700'>
                  Destination
                </label>
                <Field
                  as='textarea'
                  id='destination'
                  name='destination'
                  placeholder="trip's destination..."
                  className='w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                />
                <ErrorMessage
                  name='destination'
                  component='div'
                  className='text-red-500 text-sm'
                />
              </div>

              <div className=' grid grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='startDate' className='block text-gray-700'>
                    Start Date
                  </label>
                  <Field
                    type='date'
                    id='startDate'
                    name='startDate'
                    className='w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                  />
                  <ErrorMessage
                    name='startDate'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </div>

                <div>
                  <label htmlFor='endDate' className='block text-gray-700'>
                    End Date
                  </label>
                  <Field
                    type='date'
                    id='endDate'
                    name='endDate'
                    className='w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary'
                  />
                  <ErrorMessage
                    name='endDate'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </div>
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-[#5f8ca9] text-white px-4 py-2 rounded hover:bg-[#5f8ca9] cursor-pointer flex items-center justify-center gap-2'
              >
                {isLoading ? (
                  <>
                    <ImSpinner2 className='animate-spin' />
                    Creating...
                  </>
                ) : (
                  'Create Trip'
                )}
              </Button>
            </Form>
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTrip;
