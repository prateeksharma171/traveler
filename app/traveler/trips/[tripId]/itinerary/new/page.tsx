'use client';

import NewItineraryLocation from '@/components/NewItineraryLocation';
import { useParams } from 'next/navigation';

const NewItinerary = () => {
  const { tripId } = useParams() as { tripId: string };

  return <NewItineraryLocation tripId={tripId} />;
};

export default NewItinerary;
