'use client';

import { getTripById } from '@/app/api/system/trip';
import TripDetails, { TripWithLocation } from '@/components/TripDetails';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ImSpinner2 } from 'react-icons/im';

type Trip = {
  id: string;
  tripName: string;
  destination: string;
  country: string | null;
  state: string | null;
  category: string | null;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  imageUrl: string | null;
};

const TripDetail = () => {
  const { tripId } = useParams() as { tripId: string };
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = async () => {
      setLoading(true);
      try {
        const response = await getTripById({ tripId });

        if (response.status !== 200 || !response.trip) {
          throw new Error(response.error || 'Failed to fetch trip');
        }
        setTrip(response?.trip);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong');
      }
    };

    if (tripId) {
      fetchTrip();
    }
  }, [tripId]);

  if (loading || !trip) {
    return (
      <div className='flex justify-center items-center h-screen w-screen'>
        <ImSpinner2 className='animate-spin text-4xl text-gray-600' />
      </div>
    );
  }


  return <TripDeWWtails trip={trip as TripWithLocation} />;
};

export default TripDetail;
