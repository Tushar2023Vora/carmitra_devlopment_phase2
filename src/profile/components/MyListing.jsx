import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/clerk-react'
import { db } from './../../../configs'
import { CarImages, CarListing } from './../../../configs/schema'
import { desc, eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Service from '@/Shared/Service'
import CarItem from '@/components/CarItem'
import { FaTrashAlt } from "react-icons/fa";
function MyListing() {

    const {user}=useUser();
    const [carList,setCarList]=useState([]);
    useEffect(()=>{
        user&&GetUserCarListing();
    },[user])
    const GetUserCarListing=async()=>{
        console.log("User email:", user?.primaryEmailAddress?.emailAddress);
        const result=await db.select().from(CarListing)
        .leftJoin(CarImages,eq(CarListing.id,CarImages.carListingId))
        .where(eq(CarListing.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(CarListing.id))
       
        console.log("Raw database result:", result);
        const resp=Service.FormatResult(result)
        console.log("Formatted result:", resp);
        setCarList(resp);
    }

    const DeleteCarListing = async (id) => {
        try {
            // First delete all images associated with this listing
            await db.delete(CarImages).where(eq(CarImages.carListingId, id));
            
            // Then delete the car listing itself
            await db.delete(CarListing).where(eq(CarListing.id, id));
            
            // Refresh the list after deletion
            GetUserCarListing();
            
            console.log("Listing deleted successfully");
        } catch (error) {
            console.error("Error deleting listing:", error);
        }
    }

  return (
    <div className='mt-6'>
        <div className='flex justify-between items-center'>
                <h2 className='font-bold text-4xl'>My Listing</h2>
                <Link to={'/add-listing'}>
                    <Button>+ Add New Listing</Button>
                </Link>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-7 gap-5'>
            {carList.map((item,index)=>(
                <div key={index}>
                    <CarItem car={item} />
                    <div className='p-2 bg-gray-50 rounded-lg flex justify-between gap-3'>
                        <Link to={'/add-listing?mode=edit&id='+item?.id} className='w-full'>
                            <Button variant="outline" className="w-full">Edit</Button>
                        </Link>
                        <Button variant="destructive" onClick={() => DeleteCarListing(item?.id)}><FaTrashAlt /></Button>

                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default MyListing