import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { MdOutlineLocalOffer } from "react-icons/md";
import OfferModal from './OfferModal';

function Pricing({carDetail}) {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className='p-10 rounded-xl border shadow-md'>
        <h2>Our Price</h2>
        <h2 className='font-bold text-4xl'>₹{carDetail?.sellingPrice}</h2>

        <Button className="w-full mt-7" size="lg" onClick={() => setModalOpen(true)}>
          <MdOutlineLocalOffer className='text-lg mr-2' />  Make an Offer Price
        </Button>
        <OfferModal open={modalOpen} onClose={() => setModalOpen(false)} carId={carDetail?.id} />
    </div>
  )
}

export default Pricing