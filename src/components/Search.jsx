import React, { useState, useEffect } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from './ui/separator'
import { CiSearch } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { db } from '../../configs';
import { CarListing } from '../../configs/schema';
import Data from '@/Shared/Data';

function Search() {
  const [cars, setCars] = useState("");
  const [make, setMake] = useState("");
  const [price, setPrice] = useState("");
  const [makes, setMakes] = useState([]);

  // 🔹 fetch distinct car makes from DB
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const result = await db
          .select({ make: CarListing.make })
          .from(CarListing)
          .groupBy(CarListing.make);

        const uniqueMakes = result.map((row) => row.make).filter(Boolean);
        setMakes(uniqueMakes);
      } catch (err) {
        console.error("Error fetching makes:", err);
      }
    };
    fetchMakes();
  }, []);

  // build query string safely
  const query = new URLSearchParams();
  if (cars) query.set("cars", cars);
  if (make) query.set("make", make);
  if (price) query.set("price", price);

  return (
    <div
    className="bg-transparent flex flex-col md:flex-row gap-3 md:gap-4 lg:gap-6 items-center justify-center w-full">
      {/* Condition */}
      <Select onValueChange={(value) => setCars(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg justify-center">
          <SelectValue placeholder="Cars" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="Used">Used</SelectItem>
          <SelectItem value="Certified Pre-Owned">Certified Pre-Owned</SelectItem>
        </SelectContent>
      </Select>

      <Separator orientation="vertical" className="hidden md:block" />

      {/* Car Makes (dynamic) */}
      <Select onValueChange={(value) => setMake(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg justify-center">
          <SelectValue placeholder="Car Makes" />
        </SelectTrigger>
        {/* DYNAMIC TAKING FROM CARLISTINGS FROM NEON_DB*/}
        <SelectContent>
          {makes.length > 0 ? (
            makes.map((maker, index) => (
              <SelectItem key={index} value={maker}>
                {maker}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled>No makes found</SelectItem>
          )}
        </SelectContent>
        {/* STATIC TAKING FROM SHARED/DATA */}
        {/* <SelectContent>
        {Data.CarMakes.map((maker, index) => (
            <SelectItem key={index} value={maker.name}>
            {maker.name}
            </SelectItem>
        ))}
        </SelectContent> */}
      </Select>

      <Separator orientation="vertical" className="hidden md:block" />

      {/* Pricing (fixed ranges) */}
      {/* <Select onValueChange={(value) => setPrice(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg">
          <SelectValue placeholder="Pricing" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0-500000">Below ₹5,00,000</SelectItem>
          <SelectItem value="500000-1000000">₹5,00,000 – ₹10,00,000</SelectItem>
          <SelectItem value="1000000-1500000">₹10,00,000 – ₹15,00,000</SelectItem>
          <SelectItem value="1500000+">Above ₹15,00,000</SelectItem>
        </SelectContent>
      </Select> */}
      <Select onValueChange={(value) => setPrice(value)}>
        <SelectTrigger className="outline-none md:border-none w-full shadow-none text-lg justify-center">
            <SelectValue placeholder="Pricing" />
        </SelectTrigger>
        <SelectContent>
            {Data.Pricing.map((range, index) => (
            <SelectItem key={index} value={range.value}>
                {range.label}
            </SelectItem>
            ))}
        </SelectContent>
        </Select>

      {/* Search button */}
      <Link to={`/search?${query.toString()}`}>
        <CiSearch
          className="text-[50px] bg-primary 
        rounded-full p-3 text-white hover:scale-105 transition-all cursor-pointer"
        />
      </Link>
    </div>
  )
}

export default Search
