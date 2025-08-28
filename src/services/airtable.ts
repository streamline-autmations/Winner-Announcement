export interface Entrant {
  id: string;
  name: string;
  email?: string; // Email is not in the static list, so it's optional
  status: 'Entrant' | 'Finalist' | 'Eliminated' | 'Winner';
}

// Helper to transform an Airtable record into our Entrant type
const transformRecord = (record: any): Entrant => {
  return {
    id: record.id,
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
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
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

export const saveFinalistsToAirtable = async (finalistsToSave: Entrant[]) => {
  const liveEntrants = await getEntrants();
  
  const promises = finalistsToSave.map(finalist => {
    const liveRecord = liveEntrants.find(live => live.name === finalist.name);
    if (liveRecord) {
      return updateEntrantStatus(liveRecord.id, finalist.status);
    } else {
      console.warn(`Could not find a matching record in Airtable for: ${finalist.name}`);
      return Promise.resolve();
    }
  });

  await Promise.all(promises);
};