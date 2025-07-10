// src/utils/getEvents.ts

export async function getEvents({
  sortField = 'Start Date', // default sort
  sortDirection = 'desc',
  maxRecords,
  filters = '',
} = {}) {
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = 'More Rain';
  const token = process.env.AIRTABLE_TOKEN;

  const encodedTableName = encodeURIComponent(tableName);

  // Build query params dynamically
  const params = new URLSearchParams();
  params.append('sort[0][field]', sortField);
  params.append('sort[0][direction]', sortDirection);
  if (maxRecords) params.append('maxRecords', maxRecords.toString());
  if (filters) params.append('filterByFormula', filters);

  const url = `https://api.airtable.com/v0/${baseId}/${encodedTableName}?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Airtable fetch error: ${res.statusText} - ${errorText}`);
  }

  const data = await res.json();

  return data.records.map(record => ({
    slug: record.fields.Title
      ?.toLowerCase()
      ?.replace(/\s+/g, '-')
      ?.replace(/[^a-z0-9-]/g, '')
      ?.replace(/--+/g, '-')
      ?.replace(/^-|-$/g, ''),
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
    created: record.fields.Created,
  }));
}
