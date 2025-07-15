'use server';

import { prisma } from '@/lib/prisma';

type TripValues = {
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  userId: string;
};

type TripResponse = {
  error?: string;
  message?: string;
  tripId?: string;
  status: number;
};

export const createTrip = async (values: TripValues): Promise<TripResponse> => {
  try {
    if (
      !values?.tripName ||
      !values?.destination ||
      !values?.startDate ||
      !values?.endDate ||
      !values?.userId
    ) {
      return { error: 'Missing required fields', status: 400 };
    }

    const trip = await prisma.trip.create({
      data: values,
    });

    return {
      message: 'Trip created successfully',
      tripId: trip.id,
      status: 201,
    };
  } catch (error) {
    console.error('[CREATE_TRIP_ERROR]', error);
    return { error: 'Internal Server Error', status: 500 };
  }
};
