import { drizzleClient } from '../../configs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { carId, offer, contact } = req.body;
  if (!carId || !offer || !contact) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    // Save offer to database (table: offers)
    await drizzleClient.insert('offers', {
      carId,
      offer,
      contact,
      createdAt: new Date().toISOString(),
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save offer' });
  }
}
