'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowRight, MapIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { FaFire } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface LocationCardProps {
  tripId: string;
  title: string;
  type?: string;
  location: string;
  description: string;
  date: string;
  imageUrl?: string;
  category: string | null;
  className?: string;
}

const TripCard = ({
  tripId,
  title,
  type,
  location,
  description,
  imageUrl,
  date,
  category,
  className,
}: LocationCardProps) => {
  const router = useRouter();
  return (
    <Card
      className={cn(
        'w-full min-w-xs overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-0 cursor-pointer',
        className
      )}
      onClick={() => router.push(`/traveler/trips/${tripId}`)}
    >
      <div className='relative h-100 overflow-hidden'>
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt={title}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
            />
            {/* Gradient Overlay */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent' />
          </>
        ) : (
          <>
            {/* Placeholder Background */}
            <div className='absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900' />
            {/* Placeholder Icon */}
            <div className='absolute inset-0 flex items-center justify-center'>
              <MapIcon className='w-16 h-16 text-slate-400 dark:text-slate-600' />
            </div>
            {/* Gradient Overlay for placeholder */}
            <div className='absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent' />
          </>
        )}

        {/* Category Badge */}
        <div className='absolute top-4 left-4 flex items-center space-x-2'>
          <span className='bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full border border-white/30'>
            {category}
          </span>
          {type === 'upcoming' && (
            <FaFire className='animate-bounce text-red-500 text-lg' />
          )}
        </div>

        {/* Content Overlay */}
        <div className='absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 text-white'>
          <h3 className='text-2xl font-bold mb-2 leading-tight line-clamp-2'>
            {title}
          </h3>

          <div className='flex items-center gap-1 mb-3 text-white/90'>
            <MapPin className='w-4 h-4' />
            <span className='text-sm font-medium'>{location}</span>
          </div>

          <p className='text-white/90 text-sm leading-relaxed mb-4 line-clamp-2'>
            {description}
          </p>

          <p className='text-white/90 text-sm leading-relaxed mb-4 line-clamp-3'>
            {date}
          </p>

          <Button
            className='bg-[#608aaa] hover:bg-[#608aaa]/80 text-white rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 hover:shadow-lg cursor-pointer'
            size='sm'
            onClick={() => router.push(`/traveler/trips/${tripId}`)}
          >
            View More
            <ArrowRight className='w-4 h-4 ml-2' />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TripCard;
