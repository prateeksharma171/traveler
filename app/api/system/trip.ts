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

type GetTripsParams = {
  userId: string;
};

type GetTripsByIdParams = {
  tripId: string;
};

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

type GetTripsResponse = {
  trips?: Trip[];
  upcomingTrips?: Trip[];
  error?: string;
  status: number;
};

interface GetTripByIdResponse {
  trip?: Trip;
  error?: string;
  status: number;
}

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

export const getTrips = async ({
  userId,
}: GetTripsParams): Promise<GetTripsResponse> => {
  try {
    if (!userId) {
      return { error: 'User ID is required', status: 400 };
    }

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' },
    });

    const now = new Date();

    const upcomingTrips = trips.filter(
      (trip) => new Date(trip.startDate) >= now
    );

    return {
      trips,
      upcomingTrips,
      status: 200,
    };
  } catch (error) {
    console.error('[GET_TRIPS_ERROR]', error);
    return {
      error: 'Internal Server Error',
      status: 500,
    };
  }
};

export const getTripById = async ({
  tripId,
}: GetTripsByIdParams): Promise<GetTripByIdResponse> => {
  try {
    if (!tripId) {
      return { error: 'Trip ID is required', status: 400 };
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { locations: true },
    });

    if (!trip) {
      return {
        error: 'Trip not found',
        status: 404,
      };
    }

    return {
      trip,
      status: 200,
    };
  } catch (error) {
    console.error('[GET_TRIP_BY_ID_ERROR]', error);
    return {
      error: 'Internal Server Error',
      status: 500,
    };
  }
};

const geocodeAddress = async (address: string) => {
  const apiKey = process.env.NEXT_PUBLIC_MAP_TILER_KEY;

  if (!apiKey) {
    throw new Error('MapTiler API key is missing.');
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.maptiler.com/geocoding/${encodedAddress}.json?key=${apiKey}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to fetch geocoding data.');
  }

  const data = await res.json();

  if (data.features && data.features.length > 0) {
    const { center, place_name } = data.features[0];
    const [lng, lat] = center;
    return { lat, lng, placeName: place_name };
  } else {
    throw new Error('No matching location found.');
  }
};

export const addLocation = async (tripId: string, address: string) => {
  try {
    if (!address) {
      return { error: 'Address is required', status: 400 };
    }

    const { lat, lng, placeName } = await geocodeAddress(address);

    const count = await prisma.location.count({
      where: { tripId },
    });

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        locations: {
          create: {
            lat,
            lng,
            locationTitle: placeName,
            order: count,
          },
        },
      },
    });

    return {
      trip,
      status: 200,
    };
  } catch (error) {
    console.error('[GET_TRIP_BY_ID_ERROR]', error);
    return {
      error: 'Internal Server Error',
      status: 500,
    };
  }
};

export const recordItineraryOrder = async (
  tripId: string,
  newOrder: string[]
) => {
  try {
    if (!newOrder) {
      return { error: 'Order id is required', status: 400 };
    }

    await prisma.$transaction(
      newOrder.map((locationId: string, key: number) =>
        prisma.location.update({
          where: { id: locationId },
          data: {
            order: key,
          },
        })
      )
    );
  } catch (error) {
    console.error('[GET_TRIP_BY_ID_ERROR]', error);
    return {
      error: 'Internal Server Error',
      status: 500,
    };
  }
};
