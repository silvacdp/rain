export async function getEvents() {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = 'More Rain';
  const token = process.env.AIRTABLE_TOKEN;
  
  console.log("ENV CHECK - token:", token ? "✅ set" : "❌ MISSING");
  console.log("ENV CHECK - baseId:", baseId ? "✅ set" : "❌ MISSING");
  console.log("Token length:", token?.length);
  console.log("Token starts with:", token?.substring(0, 10) + "...");
  console.log("Base ID:", baseId);
  
  const encodedTableName = encodeURIComponent(tableName);
  const url = `https://api.airtable.com/v0/${baseId}/${encodedTableName}`;
  
  console.log("Full URL:", url);
  
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  console.log("Response status:", res.status);
  console.log("Response statusText:", res.statusText);
  
  if (!res.ok) {
    // Let's see what Airtable is actually telling us
    const errorText = await res.text();
    console.log("Error response body:", errorText);
    throw new Error(`Failed to fetch Airtable: ${res.statusText} - ${errorText}`);
  }
  
  const data = await res.json();
  return data.records.map(record => ({
    slug: record.fields.Title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, ''),
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
