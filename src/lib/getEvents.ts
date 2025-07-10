// src/lib/getEvents.ts
export async function getEvents() {
  const token = import.meta.env.AIRTABLE_TOKEN;
  const baseId = 'app6bt0nMimeKjIQ5';
  const tableName = 'Events';

  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Airtable: ${res.statusText}`);
  }

  const data = await res.json();
  return data.records.map((record: any) => ({
    id: record.id,
    ...record.fields,
  }));
}
