// src/lib/getEvents.ts
export async function getEvents() {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = 'More Rain';
  const token = process.env.AIRTABLE_TOKEN;
  
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
  slug: record.fields.Title
    .toLowerCase()                    // "hurricane katrina 2005"
    .replace(/\s+/g, '-')            // "hurricane-katrina-2005"
    .replace(/[^a-z0-9-]/g, '')      // removes any special characters
    .replace(/--+/g, '-')            // replaces multiple dashes with single dash
    .replace(/^-|-$/g, ''),          // removes dashes from start/end
  title: record.fields.Title,
  location: record.fields.Location,
  startDate: record.fields['Start Date'],
  endDate: record.fields['End Date'],
  category: record.fields.Category,
  tags: record.fields.Tags,
  quote: record.fields.Quote,
  summary: record.fields.Summary,
  imageUrl: record.fields['Image URL'],
  imageSource: record.fields['Image Source'],
  links: record.fields.Links,
  published: record.fields.Published,
  misc: record.fields.Misc,
  }));
}
