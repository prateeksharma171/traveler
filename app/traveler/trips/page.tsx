import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Trips = () => {
  return (
    <div className=" space-y-6 container mx-auto px-4 py-8">
      <div>
        <h1>Dashboard</h1>
        <Link href="/traveler/trips/new"><Button>New Trips</Button></Link>
      </div>
    </div>
  )
};

export default Trips;
