export interface Entrant {
  id: string;
  name: string;
  email: string;
  status: 'Entrant' | 'Finalist' | 'Eliminated' | 'Winner';
}

// Helper to transform an Airtable record into our Entrant type
const transformRecord = (record: any): Entrant => {
  return {
    id: record.id,
    // IMPORTANT: Replace 'Name', 'Email', and 'Status' with the exact names of your columns in Airtable.
    name: record.fields.Name,
    email: record.fields.Email,
    status: record.fields.Status,
  };
};

export const getEntrants = async (): Promise<Entrant[]> => {
  const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_NAME;
  const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable fetch failed with status: ${response.status}`);
    }

    const data = await response.json();
    // The 'records' property contains your rows
    return data.records.map(transformRecord);

  } catch (error) {
    console.error("Error fetching entrants from Airtable:", error);
    throw error;
  }
};

export const updateEntrantStatus = async (id: string, newStatus: Entrant['status']) => {
  const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
  const TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_NAME;
  const API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
  const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}/${id}`;

  try {
    const response = await fetch(url, {
      method: 'PATCH', // Use PATCH to update a record
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          // IMPORTANT: Ensure 'Status' is the exact name of your status column in Airtable.
          'Status': newStatus,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Airtable API Error:', errorData);
      throw new Error('Failed to update Airtable record');
    }

    return await response.json();

  } catch (error) {
    console.error("Error updating entrant status in Airtable:", error);
    throw error;
  }
};