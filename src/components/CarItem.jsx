// import React from 'react'
// import { Separator } from './ui/separator'
// import { LuFuel } from "react-icons/lu";
// import { TbBrandSpeedtest } from "react-icons/tb";
// import { GiGearStickPattern } from "react-icons/gi";
// import { MdOpenInNew } from "react-icons/md";
// import { Link, useParams } from 'react-router-dom';
// function CarItem({car}) {
  
//   return (
//     <Link to={'/listing-details/'+car?.id}>
//         <div className='rounded-xl bg-white border hover:shadow-md cursor-pointer'>
//         <h2 className='absolute m-2 bg-green-500 px-2 rounded-full text-sm text-white'>New</h2>
//             <img src={car?.images[0]?.imageUrl} width={'100%'} height={250}
//             className='rounded-t-xl h-[180px] object-cover'
//             />
//             <div className='p-4'>
//                 <h2 className='font-bold text-black text-lg mb-2'>{car?.listingTitle}</h2>
//                 <Separator/>
//                 <div className='grid md:grid-cols-3 mt-5'>
//                     <div className='flex flex-col items-center'>
//                         <LuFuel className='text-lg mb-2' />
//                         <h2>{car?.mileage} Miles</h2> 
//                     </div>
//                     <div className='flex flex-col items-center'>
//                     <TbBrandSpeedtest className='text-lg mb-2' />
//                         <h2>{car?.fuelType} </h2> 
//                     </div>
//                     <div className='flex flex-col items-center'>
//                     <GiGearStickPattern className='text-lg mb-2' />
//                         <h2>{car?.transmission} </h2> 
//                     </div>
//                 </div>
//                 <Separator className="my-2"/>
//                 <div className='flex items-center justify-between'>
//                     <h2 className='font-bold text-xl'>₹{car.sellingPrice}</h2>
//                     <h2 className='text-primary text-sm flex gap-2 items-center'>
                
//                         View Details   <MdOpenInNew /></h2>
//                 </div>
//             </div>
        
//         </div>
//     </Link>
//   )
// }

// export default CarItem

import React from "react";
import { motion } from "framer-motion";
import { Separator } from "./ui/separator";
import { LuFuel } from "react-icons/lu";
import { TbBrandSpeedtest } from "react-icons/tb";
import { GiGearStickPattern } from "react-icons/gi";
import { MdOpenInNew } from "react-icons/md";
import { Link } from "react-router-dom";

function CarItem({ car }) {
  return (
    <Link to={"/listing-details/" + car?.id}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative rounded-xl bg-white border hover:shadow-lg cursor-pointer overflow-hidden"
      >
        {/* Condition badge */}
        {car?.condition && (
          <span className="absolute top-2 left-2 bg-primary px-3 py-1 rounded-full text-xs text-white shadow">
            {car.condition}
          </span>
        )}

        {/* Category badge */}
        {car?.category && (
          <span className="absolute top-2 right-2 bg-green-500 px-3 py-1 rounded-full text-xs text-white shadow">
            {car.category}
          </span>
        )}

        {/* Car image */}
        <img
          src={car?.images?.[0]?.imageUrl || "/placeholder.jpg"}
          alt={car?.listingTitle}
          className="rounded-t-xl h-[180px] w-full object-cover"
        />

        {/* Card content */}
        <div className="p-4">
          <h2 className="font-bold text-black text-lg mb-1 truncate">
            {car?.listingTitle}
          </h2>
          {car?.tagline && (
            <p className="text-gray-500 text-sm mb-3 truncate">{car.tagline}</p>
          )}

          <Separator />

          <div className="grid md:grid-cols-3 mt-4 text-center text-sm">
            <div className="flex flex-col items-center">
              <TbBrandSpeedtest className="text-lg mb-1" />
              <span>{car?.mileage} km</span>
            </div>
            <div className="flex flex-col items-center">
              <LuFuel className="text-lg mb-1" />
              <span>{car?.fuelType}</span>
            </div>
            <div className="flex flex-col items-center">
              <GiGearStickPattern className="text-lg mb-1" />
              <span>{car?.transmission}</span>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="flex items-center justify-between">
            <h2 className="font-bold  text-xl text-primary">
              ₹{car?.sellingPrice}
            </h2>
            <span className="text-primary text-sm flex gap-1 items-center font-medium">
              View Details <MdOpenInNew />
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default CarItem;
