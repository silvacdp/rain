import Airtable from 'airtable';
import { marked } from 'marked';
import type { Article, ImageAttachment } from '../types';

export function getBase() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    throw new Error('Missing Airtable credentials');
  }

  const base = new Airtable({ apiKey }).base(baseId);
  return base;
}

/*
import Airtable from 'airtable';
import { marked } from 'marked';

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  throw new Error('Missing Airtable credentials');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
*/

// Define the structure of an image attachment as provided by Airtable
export interface ImageAttachment {
  id: string;
  url: string;
  filename: string;
  type: string;
  size: number;
  thumbnails?: {
    small?: {
      url: string;
      width: number;
      height: number;
    };
    large?: {
      url: string;
      width: number;
      height: number;
    };
    full?: {
      url: string;
      width: number;
      height: number;
    };
  };
}

export interface Article {
  id: string;
  header: string;
  body: string;
  originalLink: string;
  postType: 'LinkedIn Post' | 'Blog post' | 'Thread';
  slug: string;
  images: ImageAttachment[]; // Array of image attachment objects
  publishedAt: Date;
  shortDescription: string;
  html: string;
}

export async function getAllArticles(): Promise<Article[]> {
  const records = await base('Articles').select().all();

  return records.map(record => {

    const htmlContent = marked(record.get('Body') as string, {
      'breaks': true,
      gfm: true
    }) as string;

    return {
      id: record.id,
      header: record.get('Header') as string,
      body: record.get('Body') as string,
      html: htmlContent,
      originalLink: record.get('Original Link') as string,
      postType: record.get('Post Type') as Article['postType'],
      slug: createSlug(record.get('Header') as string),
      images: record.get('Images') as ImageAttachment[],
      publishedAt: new Date(record.get('Published at') as string),
      shortDescription: htmlContent.replace(/<[^>]*>/g, '')
        .replace(/\r?\n|\r/g, ' ')  // remove line breaks
        .slice(0, 160)              // limit length
        .trim() + '...'
    };
  })
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
