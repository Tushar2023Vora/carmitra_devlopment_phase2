// import { UserProfile } from "@clerk/clerk-react";
// import Header from '@/components/Header'
// import { Button } from '@/components/ui/button'
// import React from 'react'
// import { Link } from 'react-router-dom'
// import MyListing from './components/MyListing'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import Inbox from './components/Inbox'

// function Profile() {
//   return (
//     <div>
//         <Header/>
//         <div className='px-10 md:px-20 my-10'>
//         <Tabs defaultValue="my-listing" className="w-full">
//         <TabsList className="w-full flex justify-start">
//           <TabsTrigger value="my-listing">My Listing</TabsTrigger>
//           <TabsTrigger value="inbox">Inbox</TabsTrigger>
//           <TabsTrigger value="profile">Profile</TabsTrigger>

//         </TabsList>
//         <TabsContent value="my-listing" >
//         <MyListing/>
//         </TabsContent>
//         <TabsContent value="inbox"><Inbox/></TabsContent>
//         <TabsContent value="profile"><UserProfile /></TabsContent>

//       </Tabs>

           
//         </div>
//     </div>
//   )
// }

// export default Profile

import { UserProfile } from "@clerk/clerk-react";
import Header from '@/components/Header';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyListing from './components/MyListing';
import Inbox from './components/Inbox';
import { db } from "../../configs";
import { CarListing } from "../../configs/schema";
import { Offers } from "../../configs/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/clerk-react";

function StatsCard({ title, value, color }) {
  return (
    <div
      className={`rounded-xl p-6 shadow-lg text-white ${color} flex flex-col justify-center items-center`}
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-3xl mt-2">{value}</p>
    </div>
  );
}

function ProfileDashboard({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 my-10">
      <StatsCard title="My Listings" value={stats.listings} color="bg-indigo-500" />
      <StatsCard title="Offers Received" value={stats.offers} color="bg-purple-500" />
      <StatsCard title="Avg. Price" value={`₹${stats.avgPrice}`} color="bg-green-500" />
      <StatsCard title="Favorites" value={stats.favorites} color="bg-pink-500" />
    </div>
  );
}

function Profile() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    listings: 0,
    offers: 0,
    avgPrice: 0,
    favorites: 0,
  });

  useEffect(() => {
  const fetchStats = async () => {
    if (!user) return;

    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || null;
      if (!userEmail) {
        setStats({
          listings: 0,
          offers: 0,
          avgPrice: 0,
          favorites: 0
        });
        return;
      }

      // 1) Fetch listings for this user
      const listings = await db
        .select()
        .from(CarListing)
        .where(eq(CarListing.createdBy, userEmail));

      const totalListings = Array.isArray(listings) ? listings.length : 0;
      const listingIds = listings.map((l) => l.id).filter(Boolean);

      // 2) Parse sellingPrice (strings like "₹14,25,000" or "14,25,000")
      const stripToInt = (val) => {
        if (val == null) return 0;
        const s = String(val);
        const digits = s.replace(/[^\d]/g, ""); // remove commas, ₹, spaces, etc
        return digits ? parseInt(digits, 10) : 0;
      };

      const sumPrices = listings.reduce((acc, l) => acc + stripToInt(l.sellingPrice), 0);
      const avgPriceNum = totalListings > 0 ? Math.round(sumPrices / totalListings) : 0;

      // Format avgPrice for display (Indian numbering)
      const avgPriceFormatted = avgPriceNum ? new Intl.NumberFormat('en-IN').format(avgPriceNum) : 0;

      // 3) Offers count: fetch offers table and count those linked to this user's listings.
      //    (If your DB has many offers, you should replace this with a DB-side aggregation.)
      let offersCount = 0;
      try {
        const allOffers = await db.select().from(Offers);
        offersCount = allOffers.filter(o => listingIds.includes(o.carId)).length;
      } catch (err) {
        // If Offers table doesn't exist or query fails, keep offersCount = 0
        console.warn("Offers fetch error:", err);
        offersCount = 0;
      }

      // 4) Favorites: placeholder until you have a favorites table
      let favoritesCount = 0;
      // TODO: replace with real favorites query when you add favorites table.

      setStats({
        listings: totalListings,
        offers: offersCount,
        avgPrice: avgPriceFormatted,
        favorites: favoritesCount,
      });
    } catch (error) {
      console.error("Error fetching profile stats:", error);
      setStats({
        listings: 0,
        offers: 0,
        avgPrice: 0,
        favorites: 0,
      });
    }
  };

  fetchStats();
}, [user]);

  return (
    <div>
      <Header />
      <div className="px-10 md:px-20 my-10">
        {/*Dashboard Stats */}
        <ProfileDashboard stats={stats} />

        {/* Tabs */}
        <Tabs defaultValue="my-listing" className="w-full">
          <TabsList className="w-full flex justify-start">
            <TabsTrigger value="my-listing">My Listing</TabsTrigger>
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="my-listing">
            <MyListing />
          </TabsContent>
          <TabsContent value="inbox">
            <Inbox />
          </TabsContent>
          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;
