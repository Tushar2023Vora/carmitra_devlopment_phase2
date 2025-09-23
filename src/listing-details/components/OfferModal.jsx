import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function OfferModal({ open, onClose, carId }) {
  const [offer, setOffer] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Replace with your actual API endpoint
    const res = await fetch('/api/offer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carId, offer, contact })
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Make an Offer</h2>
        {success ? (
          <div className="text-green-600">Offer submitted! Seller will contact you soon.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Your Offer (₹)</label>
              <input type="number" required className="w-full border rounded px-3 py-2" value={offer} onChange={e => setOffer(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Contact Info</label>
              <input type="text" required className="w-full border rounded px-3 py-2" value={contact} onChange={e => setContact(e.target.value)} placeholder="Email or Phone" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit Offer'}</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
