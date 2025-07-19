'use client';

import { Boxes, CalendarIcon, MapIcon, MapPin, Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useState } from 'react';
import { Trip } from '@/prisma/generated/client';
import Map, { Location } from './Map';
import SortableItinerary from './SortableItinerary';
import { Country, State } from 'country-state-city';

export type TripWithLocation = Trip & {
  locations: Location[];
  description: string;
};

interface TripDetailsProps {
  trip: TripWithLocation;
}

const TripDetails = ({ trip }: TripDetailsProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const countryData = Country.getCountryByCode(trip.country!);
  const stateData = State.getStateByCodeAndCountry(trip.state!, trip.country!);

  if (!trip) {
    return (
      <div className='flex justify-center items-center h-screen w-screen'>
        <p className='text-4xl text-gray-600'>Trip not found</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8 space-y-8'>
      {trip.imageUrl && (
        <div className=' w-full h-72 md:h-96 relative overflow-hidden shadow-lg rounded-xl'>
          <Image
            src={trip.imageUrl}
            alt={trip.tripName}
            fill
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent' />
        </div>
      )}

      <div className=' bg-white shadow rounded-lg flex flex-col md:flex-row justify-start items-start md:items-center p-2'>
        <div>
          <p className=' text-4xl font-extrabold text-gray-900'>
            {trip.tripName}
          </p>
          <div className='flex items-center text-gray-500 mt-2'>
            <CalendarIcon className='w-4 h-4 mr-2' />
            <span className=' text-lg'>
              {trip.startDate.toLocaleDateString()} -{' '}
              {trip.endDate.toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className='mt-4 md:mt-0 md:ml-4'>
          <Link href={`/traveler/trips/${trip.id}/itinerary/new`}>
            <Button className='bg-gradient-to-r from-[#5f8cab] to-[#8aabc2] hover:from-[#6993b0] hover:to-[#6993b0] cursor-pointer'>
              <Plus className=' w-4 h-4 mr-2' /> Create Itinerary
            </Button>
          </Link>
        </div>
      </div>

      <div className=' bg-white p-6 shadow rounded-lg'>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className=' mb-6 gap-7'>
            <TabsTrigger value='overview' className=' text-lg'>
              Overview
            </TabsTrigger>
            <TabsTrigger value='itinerary' className=' text-lg'>
              Itinerary
            </TabsTrigger>
            <TabsTrigger value='map' className=' text-lg'>
              Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className=' space-y-6'>
            <div className=' grid md:grid-cols-2 gap-6'>
              <div>
                <h2 className=' text-2xl font-semibold mb-4'>Trip summary</h2>
                <div className=' space-y-4'>
                  <div className=' flex items-center'>
                    <CalendarIcon className=' w-6 h-6 mr-2 text-gray-500' />
                    <div>
                      <p className=' font-medium text-gray-700'>Dates</p>
                      <p className=' font-medium text-gray-700'>
                        {trip.startDate.toLocaleDateString()} -{' '}
                        {trip.endDate.toLocaleDateString()}
                        <br />
                        {`${
                          trip.endDate.getDate() - trip.startDate.getDate()
                        } days`}
                      </p>
                    </div>
                  </div>
                  <div className=' flex items-center'>
                    <MapPin className=' w-6 h-6 mr-3 text-gray-500' />
                    <div>
                      <p>Destinations</p>
                      <p>
                        {trip.locations.length === 1
                          ? '1 location'
                          : `${trip.locations.length} locations`}
                      </p>
                    </div>
                  </div>
                  <div className='  flex items-center'>
                    <MapIcon className=' w-6 h-6 mr-3 text-gray-500' />
                    <div>
                      <p>Locations</p>
                      <p>
                        {countryData?.name} {stateData?.name}
                      </p>
                    </div>
                  </div>
                  <div className='  flex items-center'>
                    <Boxes className=' w-6 h-6 mr-3 text-gray-500' />
                    <div>
                      <p>Category</p>
                      <p>{trip.category}</p>
                    </div>
                  </div>
                  <div className=' mt-5'>
                    <p>{trip.destination}</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='itinerary' className=' space-y-6'>
            <div className=' flex justify-between items-center mb-4'>
              <h1 className=' text-2xl font-semibold'>Full Itinerary</h1>
            </div>

            {trip.locations.length <= 0 ? (
              <div className=' flex items-center justify-center h-72'>
                <p className=' text-gray-500 text-center'>
                  No itineraries found
                </p>
              </div>
            ) : (
              // @ts-ignore
              <SortableItinerary locations={trip.locations} tripId={trip.id} />
            )}
          </TabsContent>

          <TabsContent value='map' className=' space-y-6'>
            {trip.locations.length > 0 && (
              <div className=' h-full rounded-lg overflow-hidden shadow mt-5'>
                <Map itineraries={trip.locations as Location[]} />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TripDetails;
