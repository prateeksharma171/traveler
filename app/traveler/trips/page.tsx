'use client';

import { getTrips } from '@/app/api/system/trip';
import TripCard from '@/components/TripCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
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

const Trips = () => {
  const session = useSession();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = session.data?.user?.id;

    if (!userId) return;

    const fetchTrips = async () => {
      setLoading(true);

      const res = await getTrips({ userId });

      if (res.error) {
        toast.error(res.error);
      } else {
        setTrips(res.trips || []);
        setUpcomingTrips(res.upcomingTrips || []);
      }

      setLoading(false);
    };

    fetchTrips();
  }, [session.data?.user?.id]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen w-screen'>
        <ImSpinner2 className='animate-spin text-4xl text-gray-600' />
      </div>
    );
  }

  return (
    <div className=' space-y-6 container mx-auto px-4 py-8'>
      <div className='flex items-center justify-between'>
        <h1 className=' text-3xl font-bold tracking-tight'>Dashboard</h1>
        <Link href='/traveler/trips/new'>
          <Button className=' cursor-pointer bg-gradient-to-r from-[#5f8cab] to-[#8aabc2] hover:from-[#6993b0] hover:to-[#6993b0]'>
            <PlusCircle className='w-5 h-5' />
            New Trips
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome Back {session.data?.user?.name}</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <ImSpinner2 className='animate-spin mr-2' />
          ) : (
            <p>
              {trips.length === 0
                ? 'Start creating your first trip'
                : `You have ${trips.length} ${
                    trips.length === 1 ? 'trip' : 'trips'
                  } planned${
                    upcomingTrips.length > 0
                      ? `, ${upcomingTrips.length} upcoming.`
                      : '.'
                  }`}
            </p>
          )}
        </CardContent>
      </Card>

      {upcomingTrips.length > 0 && (
        <div>
          <h2 className=' text-xl font-semibold mb-4'>Upcoming trips</h2>
          {trips.length === 0 ? (
            <Card>
              <CardContent className=' flex flex-col items-center justify-center py-8'>
                <h3 className=' text-xl font-medium mb-2'>No trips found</h3>
                <p className=' text-center mb-4 max-w-md'>
                  Start creating your first trip to get started.
                </p>
                <Link href='/traveler/trips/new'>
                  <Button className=' cursor-pointer'>New Trips</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className='grid grid-cols-5 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
              {upcomingTrips.map((trip) => (
                <TripCard
                  tripId={trip.id}
                  key={trip.id}
                  type='upcoming'
                  title={trip.tripName}
                  description={trip.destination}
                  location={`${trip.country}, ${trip.state}`}
                  category={trip.category}
                  date={`From ${new Date(
                    trip.startDate
                  ).toLocaleDateString()} to ${new Date(
                    trip.endDate
                  ).toLocaleDateString()}`}
                  imageUrl={trip.imageUrl || ''}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <div>
        <h2 className=' text-xl font-semibold mb-4'>Your trips</h2>
        {trips.length === 0 ? (
          <Card>
            <CardContent className=' flex flex-col items-center justify-center py-8'>
              <h3 className=' text-xl font-medium mb-2'>No trips found</h3>
              <p className=' text-center mb-4 max-w-md'>
                Start creating your first trip to get started.
              </p>
              <Link href='/traveler/trips/new'>
                <Button className=' cursor-pointer'>New Trips</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-5 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                tripId={trip.id}
                title={trip.tripName}
                description={trip.destination}
                location={`${trip.country}, ${trip.state}`}
                category={trip.category}
                date={`From ${new Date(
                  trip.startDate
                ).toLocaleDateString()} to ${new Date(
                  trip.endDate
                ).toLocaleDateString()}`}
                imageUrl={trip.imageUrl || ''}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;
