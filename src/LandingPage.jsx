// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from 'react-router-dom';

// import Footer from './components/Footer';

// export default function LandingPage() {
//   const navigate = useNavigate();
//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {/* Custom Landing Page Header */}
//       <header className="w-full py-8 bg-gradient-to-r from-teal-500 to-blue-500 flex flex-col items-center justify-center shadow-lg">
//         <span className="text-4xl md:text-5xl font-extrabold text-white tracking-wide drop-shadow-lg">CarMitra</span>
//         <span className="mt-2 text-lg md:text-xl text-white/80">Find your dream car, effortlessly</span>
//       </header>
//       <main className="flex flex-col items-center justify-center flex-1 py-20 px-4">
//         <h1 className="text-4xl md:text-6xl font-extrabold text-teal-700 mb-6 text-center">Welcome to CarMitra</h1>
//         <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-xl text-center">
//           India's trusted marketplace for buying and selling cars. Discover thousands of verified listings, connect with sellers, and find your dream car with confidence.
//         </p>
//         <div className="flex gap-6">
//           <Button className="text-lg px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg" onClick={() => navigate('/auth')}>Get Started</Button>
//           <Button className="text-lg px-8 py-3 bg-white border border-teal-600 text-teal-700 rounded-full shadow-lg" onClick={() => navigate('/search')}>Browse Cars</Button>
//         </div>
//       </main>
//       <Footer />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import Data from "@/Shared/Data";
import CarItem from "@/components/CarItem";
import { db } from "../configs";
import { CarListing, CarImages } from "../configs/schema";
import { eq, desc } from "drizzle-orm";
import Service from "@/Shared/Service";
import { motion } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();
  const [featuredCars, setFeaturedCars] = useState([]);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const result = await db
          .select()
          .from(CarListing)
          .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId))
          .orderBy(desc(CarListing.id))
          .limit(4);

        const resp = Service.FormatResult(result);
        setFeaturedCars(resp);
      } catch (error) {
        console.error("Error fetching featured cars:", error);
      }
    };
    fetchFeaturedCars();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero */}
      <header className="relative w-full h-[500px] bg-gradient-to-r from-teal-500 to-blue-600 flex flex-col items-center justify-center shadow-lg text-white">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-6xl font-extrabold tracking-wide text-center"
        >
          CarMitra 
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-lg md:text-xl text-white/80 font-bold text-center max-w-2xl"
        >
          India’s trusted marketplace for buying & selling cars. Discover, connect, and drive your dream car.
        </motion.p>

        <div className="mt-8 flex gap-6">
          <Button
            className="text-lg px-8 py-3 bg-white text-teal-700 rounded-full shadow-lg hover:scale-105 transition-all"
            onClick={() => navigate("/auth")}
          >
            Get Started
          </Button>
          <Button
            className="text-lg px-8 py-3 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 hover:scale-105 transition-all"
            onClick={() => navigate("/search")}
          >
            Browse Cars
          </Button>
        </div>
      </header>

      {/* Categories */}
      <section className="py-16 px-6 md:px-20 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 justify-center">
          {Data.Category.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              <img src={cat.icon} alt={cat.name} className="h-14 mb-2" />
              <span className="font-medium text-gray-700">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 px-6 md:px-20">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Featured Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCars.length > 0 ? (
            featuredCars.map((car) => <CarItem key={car.id} car={car} />)
          ) : (
            <p className="text-center col-span-full text-gray-500">Loading featured cars...</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
