import Airtable from 'airtable';

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  throw new Error('Missing Airtable credentials');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export interface Article {
  id: string;
  header: string;
  body: string;
  originalLink: string;
  postType: 'LinkedIn Post' | 'Blog post' | 'Thread';
  slug: string;
}

export async function getAllArticles(): Promise<Article[]> {
  const records = await base('Articles').select().all();
  
  return records.map(record => ({
    id: record.id,
    header: record.get('Header') as string,
    body: record.get('Body') as string,
    originalLink: record.get('Original Link') as string,
    postType: record.get('Post Type') as Article['postType'],
    slug: createSlug(record.get('Header') as string)
  }));
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}