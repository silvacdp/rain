// src/lib/getEvents.ts
export async function getEvents() {
  const baseId = import.meta.env.AIRTABLE_BASE_ID;
  const tableName = 'More Rain';
  const token = import.meta.env.AIRTABLE_TOKEN;

  console.log("ENV CHECK - token:", token ? "✅ set" : "❌ MISSING");
  console.log("ENV CHECK - baseId:", baseId ? "✅ set" : "❌ MISSING");

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Airtable: ${res.statusText}`);
  }

  const data = await res.json();
  return data.records.map(record => ({
    slug: record.fields.Slug,
    title: record.fields.Title,
    date: record.fields.Date,
    location: record.fields.Location,
    summary: record.fields.Summary,
  }));
}
