import Service from '@/Shared/Service';
import { db } from './../../configs';
import { CarImages, CarListing } from './../../configs/schema';
import { and, eq, lte, gte, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '@/components/Header';
import Search from '@/components/Search';
import CarItem from '@/components/CarItem';

function SearchByOptions() {
  const [searchParam] = useSearchParams();
  const [carList, setCarList] = useState([]);

  const condition = searchParam.get('cars');   // e.g. "New" / "Used"
  const make = searchParam.get('make');       // e.g. "Hyundai"
//   const rawPrice = searchParam.get('price');
//   const price = rawPrice && rawPrice !== "undefined" ? rawPrice : null;
  const price = searchParam.get('price');
  const normalizePrice = (price) =>
  price ? parseInt(price.toString().replace(/,/g, ""), 10) : null;


  useEffect(() => {
    GetCarList();
  }, [condition, make, price]);

  const GetCarList = async () => {
    // build conditions array
    const filters = [];

    if (condition) {
      filters.push(eq(CarListing.condition, condition));
    }

    if (make) {
      filters.push(eq(CarListing.make, make));
    }

    if (price) {
    if (price === "0-500000") {
        filters.push(
        lte(sql`CAST(REPLACE(REPLACE(${CarListing.sellingPrice}, ',', ''), '₹', '') AS INTEGER)`, 500000)
        );
    } else if (price === "500000-1000000") {
        filters.push(and(
        gte(sql`CAST(REPLACE(REPLACE(${CarListing.sellingPrice}, ',', ''), '₹', '') AS INTEGER)`, 500000),
        lte(sql`CAST(REPLACE(REPLACE(${CarListing.sellingPrice}, ',', ''), '₹', '') AS INTEGER)`, 1000000)
        ));
    } else if (price === "1000000-1500000") {
        filters.push(and(
        gte(sql`CAST(REPLACE(REPLACE(${CarListing.sellingPrice}, ',', ''), '₹', '') AS INTEGER)`, 1000000),
        lte(sql`CAST(REPLACE(REPLACE(${CarListing.sellingPrice}, ',', ''), '₹', '') AS INTEGER)`, 1500000)
        ));
    } else if (price === "1500000+") {
        filters.push(
        gte(sql`CAST(REPLACE(REPLACE(${CarListing.sellingPrice}, ',', ''), '₹', '') AS INTEGER)`, 1500000)
        );
    }
    }

    let query = db.select().from(CarListing)
      .innerJoin(CarImages, eq(CarListing.id, CarImages.carListingId));

    if (filters.length > 0) {
      query = query.where(and(...filters));
    }

    const result = await query;
    const resp = Service.FormatResult(result);
    console.log("Filtered results:", resp);
    setCarList(resp);
  }

  return (
    <div>
      <Header />

      <div className='p-0 bg-neutral-400 flex justify-center'>
        <Search />
      </div>

      <div className='p-10 md:px-20'>
        <h2 className='font-bold text-4xl '>Search Result</h2>

        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-7'>
          {carList?.length > 0 ? carList.map((item, index) => (
            <div key={index}>
              <CarItem car={item} />
            </div>
          )) :
            [1, 2, 3, 4, 5, 6].map((item, index) => (
              <div key={index} className='h-[320px] rounded-xl bg-slate-200 animate-pulse'></div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default SearchByOptions
