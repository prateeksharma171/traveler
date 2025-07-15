/** @format */

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
import { Clock, FileText, MapPin, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

const NewTrip = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { data: session } = useSession();
  const initialValues = {
    tripName: '',
    destination: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
  };

  const validationSchema = Yup.object({
    tripName: Yup.string().required('Trip name is required'),
    destination: Yup.string().required('Destination is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date().required('End date is required'),
    imageUrl: Yup.string().url('Must be a valid URL').nullable(),
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
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 flex items-center justify-center'>
      <Card className='w-full max-w-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm'>
        <CardHeader className='text-center pb-8'>
          <div className='mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-[#5f8cab] to-[#8aabc2] rounded-full flex items-center justify-center'>
            <MapPin className='w-8 h-8 text-white' />
          </div>
          <h2 className='text-3xl font-bold bg-gradient-to-r from-[#5f8cab] to-[#8aabc2] bg-clip-text text-transparent'>
            Create New Trip
          </h2>
          <p className='text-lg text-gray-600 mt-2'>
            Plan your next adventure with all the details
          </p>
        </CardHeader>

        <CardContent className='space-y-6'>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className='space-y-6'>
                {/* Trip Cover Image */}
                <div className='space-y-2'>
                  <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                    <FileText className='w-4 h-4' /> Trip Cover Image
                  </label>

                  <div className='relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors'>
                    <Input
                      type='file'
                      accept='image/*'
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        setUploading(true);
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append(
                          'upload_preset',
                          process.env.NEXT_PUBLIC_CLOUDINARY_PRESETS || ''
                        );

                        try {
                          const res = await fetch(
                            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                            {
                              method: 'POST',
                              body: formData,
                            }
                          );

                          const data = await res.json();
                          console.log('Cloudinary Response:', data);
                          if (data.secure_url) {
                            setFieldValue('imageUrl', data.secure_url);
                            toast.success('Image uploaded!');
                          } else {
                            throw new Error('Upload failed');
                          }
                        } catch (err) {
                          console.error(err);
                          toast.error('Image upload failed.');
                        } finally {
                          setUploading(false);
                        }
                      }}
                      className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                    />
                    {uploading ? (
                      <div className='flex items-center justify-center h-48'>
                        <ImSpinner2 className='animate-spin text-gray-500 text-3xl' />
                      </div>
                    ) : !values.imageUrl ? (
                      <div className='flex flex-col items-center text-gray-400'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='35'
                          height='35'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path d='M12 13v8' />
                          <path d='M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242' />
                          <path d='m8 17 4-4 4 4' />
                        </svg>
                        <span>Click or drag image here to upload</span>
                      </div>
                    ) : (
                      <Image
                        src={values.imageUrl}
                        alt='Trip preview'
                        className='w-full h-48 object-cover rounded-md'
                        width={400}
                        height={200}
                      />
                    )}
                  </div>
                  <ErrorMessage
                    name='imageUrl'
                    component='div'
                    className='text-sm text-red-500'
                  />
                </div>

                {/* Trip Name */}
                <div className='space-y-2'>
                  <label
                    htmlFor='tripName'
                    className='text-sm font-semibold text-gray-700 flex items-center gap-2'
                  >
                    <FileText className='w-4 h-4' /> Trip Name
                  </label>
                  <Field
                    id='tripName'
                    name='tripName'
                    placeholder='e.g., Summer Europe Adventure'
                    className='w-full h-12 text-lg border-2 rounded px-4 focus:border-[#5f8cab] transition-colors'
                  />
                  <ErrorMessage
                    name='tripName'
                    component='div'
                    className='text-sm text-red-500'
                  />
                </div>

                {/* Destination */}
                <div className='space-y-2'>
                  <label
                    htmlFor='destination'
                    className='text-sm font-semibold text-gray-700 flex items-center gap-2'
                  >
                    <FileText className='w-4 h-4' /> Destination
                  </label>
                  <Field
                    as='textarea'
                    id='destination'
                    name='destination'
                    placeholder='Describe your destination and activities...'
                    className='w-full min-h-[120px] text-lg border-2 rounded px-4 py-2 focus:border-[#5f8cab] transition-colors resize-none'
                  />
                  <ErrorMessage
                    name='destination'
                    component='div'
                    className='text-sm text-red-500'
                  />
                </div>

                {/* Dates */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Start Date */}
                  <div className='space-y-2'>
                    <label
                      htmlFor='startDate'
                      className='text-sm font-semibold text-gray-700 flex items-center gap-2'
                    >
                      <Clock className='w-4 h-4' /> Start Date
                    </label>
                    <Field
                      type='date'
                      id='startDate'
                      name='startDate'
                      className='w-full h-12 text-lg border-2 rounded px-4 focus:border-[#5f8cab] transition-colors'
                    />
                    <ErrorMessage
                      name='startDate'
                      component='div'
                      className='text-sm text-red-500'
                    />
                  </div>

                  {/* End Date */}
                  <div className='space-y-2'>
                    <label
                      htmlFor='endDate'
                      className='text-sm font-semibold text-gray-700 flex items-center gap-2'
                    >
                      <Clock className='w-4 h-4' /> End Date
                    </label>
                    <Field
                      type='date'
                      id='endDate'
                      name='endDate'
                      className='w-full h-12 text-lg border-2 rounded px-4 focus:border-[#5f8cab] transition-colors'
                    />
                    <ErrorMessage
                      name='endDate'
                      component='div'
                      className='text-sm text-red-500'
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='w-full h-14 cursor-pointer text-lg font-semibold bg-gradient-to-r from-[#5f8cab] to-[#8aabc2] hover:from-[#6993b0] hover:to-[#6993b0] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-white flex items-center justify-center gap-2'
                >
                  {isLoading ? (
                    <>
                      <ImSpinner2 className='animate-spin' />
                      Creating Trip...
                    </>
                  ) : (
                    <>
                      <PlusCircle className='w-8 h-8' /> Create Trip
                    </>
                  )}
                </Button>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTrip;
