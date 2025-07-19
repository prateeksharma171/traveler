"use client";

import { recordItineraryOrder } from "@/app/api/system/trip";
import { Location } from "@/prisma/generated/client";
import { closestCenter, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import React, { useId, useState } from "react";

interface SortableItineraryProps {
    locations: Location[];
    tripId: string;
}

const SortableItem = ({location}:{location:Location}) => {
    const {attributes, listeners, setNodeRef, transform, transition}=useSortable({id:location.id})
    return (
      <div ref={setNodeRef} {...attributes} {...listeners} style={{transform: `translate(${transform?.x}px, ${transform?.y}px)`, transition}} className='p-4 border rounded-md flex justify-between items-center hover:shadow transition-shadow'>
        <div>
          <h4 className=" font-medium text-gray-800">{location.locationTitle}</h4>
          <p className=" text-sm text-gray-500 truncate max-w-xs">{`Latitude: ${location.lat}, Longitude: ${location.lng}`}</p>
        </div>
        <div className=" text-sm text-gray-600">Day {location.order}</div>
      </div>
    );
};

const SortableItinerary = ({locations, tripId}:SortableItineraryProps) => {
    const [localLocations, setLocalLocations]=useState(locations)
    const id=useId();

    const handleDragEnd = async(event:DragEndEvent) => {
        const {active, over} = event;
        if (active.id !== over?.id) {
            const oldIndex= localLocations.findIndex((loc) => loc.id === active.id);
            const newIndex= localLocations.findIndex((loc) => loc.id === over!.id);
            const newLocationsOrder=arrayMove(localLocations, oldIndex, newIndex).map((loc, index) => ({
                ...loc,
                order: index
            }))
            setLocalLocations(newLocationsOrder)
            await recordItineraryOrder(tripId, newLocationsOrder.map((loc) => loc.id))
        }
    }
  return (
    <DndContext
      id={id}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={localLocations.map((loc) => loc.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='space-y-4'>
          {localLocations.sort((a, b) => a.order - b.order)?.map((loc) => (
            // @ts-ignore
            <SortableItem key={loc.id} location={loc} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default SortableItinerary;
