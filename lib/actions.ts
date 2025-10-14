import { sanity } from './sanity';

// Types
type Language = 'en' | 'ta';
type PublishStatus = 'draft' | 'published';

interface Image {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

interface File {
  _type: 'file';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface Author {
  _id: string;
  _type: 'author';
  name: string;
  bio?: string;
  profile_pic?: Image;
  publish_status: PublishStatus;
}

export interface Book {
  _id: string;
  _type: 'book';
  title: string;
  description?: string;
  author: {
    _id: string;
    _type: 'author';
    name?: string;
    profile_pic?: Image;
  };
  lang: Language;
  mrp_price?: number;
  offer_price?: number;
  amazon_link?: string;
  flipkart_link?: string;
  cover_front?: Image;
  cover_back?: Image;
  sample_pdf?: File;
  publish_status: PublishStatus;
}

export interface Journal {
  _id: string;
  _type: 'journal';
  title: string;
  description?: string;
  lang: Language;
  month?: string;
  year?: number;
  pdf?: File;
  publish_status: PublishStatus;
}

// Common query options
interface QueryOptions {
  search?: string;
  page?: number;
  limit?: number;
  lang?: Language;
}

// ------------------ BOOKS ------------------

export async function getBooks(options: QueryOptions = {}): Promise<Book[]> {
  const { search = '', page = 1, limit = 10, lang } = options;
  const start = (page - 1) * limit;
  
  const query = `
    *[_type == "book" 
      ${search ? '&& title match $search' : ''}
      ${lang ? '&& lang == $lang' : ''}
      && publish_status == "published"
    ] | order(_createdAt desc) [${start}...${start + limit}] {
      _id,
      _type,
      title,
      description,
      "author": author->{_id, name, "profile_pic": profile_pic.asset->url},
      lang,
      mrp_price,
      offer_price,
      amazon_link,
      flipkart_link,
      "cover_front": cover_front.asset->url,
      "cover_back": cover_back.asset->url,
      "sample_pdf": sample_pdf.asset->url,
      publish_status
    }
  `;
  
  const params: { search?: string; lang?: Language } = {};
  if (search) params.search = `*${search}*`;
  if (lang) params.lang = lang;
  
  return sanity.fetch(query, params);
}

// In lib/actions.ts
export async function getBookById(id: string): Promise<Book> {
  const book = await sanity.fetch(
    `*[_type == "book" && _id == $id][0]{
      ...,
      "author": author->{
        _id,
        name,
        profile_pic
      },
      "cover_front": cover_front.asset->url,
      "cover_back": cover_back.asset->url,
      "sample_pdf": sample_pdf.asset->url
    }`,
    { id }
  );

  if (!book) {
    throw new Error('Book not found');
  }

  return book;
}

// ------------------ AUTHORS ------------------

export async function getAuthors(options: QueryOptions = {}): Promise<Author[]> {
  const { search = '', page = 1, limit = 10 } = options;
  const start = (page - 1) * limit;
  
  const query = `
    *[_type == "author" 
      ${search ? '&& (name match $search || bio match $search)' : ''}
      && publish_status == "published"
    ] | order(name asc) [${start}...${start + limit}] {
      _id,
      _type,
      name,
      bio,
      "profile_pic": profile_pic.asset->url,
      publish_status
    }
  `;
  
  const params: { search?: string; lang?: Language } = {};
  if (search) params.search = `*${search}*`;
  
  return sanity.fetch(query, params);
}

export async function getAuthorById(id: string): Promise<Author & { books: Book[] }> {
  const [author, books] = await Promise.all([
    sanity.fetch(
      `*[_type == "author" && _id == $id][0] {
        _id,
        _type,
        name,
        bio,
        "profile_pic": profile_pic.asset->url,
        publish_status
      }`,
      { id }
    ),
    sanity.fetch(
      `*[_type == "book" && author._ref == $id && publish_status == "published"] {
        _id,
        title,
        "cover_front": cover_front.asset->url,
        lang,
        mrp_price,
        offer_price
      }`,
      { id }
    )
  ]);

  return { ...author, books };
}

// ------------------ JOURNALS ------------------

export async function getJournals(options: QueryOptions = {}): Promise<Journal[]> {
  const { search = '', page = 1, limit = 10, lang } = options;
  const start = (page - 1) * limit;
  
  const query = `
    *[_type == "journal" 
      ${search ? '&& title match $search' : ''}
      ${lang ? '&& lang == $lang' : ''}
      && publish_status == "published"
    ] | order(year desc, month desc) [${start}...${start + limit}] {
      _id,
      _type,
      title,
      description,
      lang,
      month,
      year,
      "pdf": pdf.asset->url,
      publish_status
    }
  `;
  
  const params: { search?: string; lang?: Language } = {};
  if (search) params.search = `*${search}*`;
  if (lang) params.lang = lang;
  
  return sanity.fetch(query, params);
}

export async function getJournalById(id: string): Promise<Journal> {
  return sanity.fetch(
    `*[_type == "journal" && _id == $id][0] {
      _id,
      _type,
      title,
      description,
      lang,
      month,
      year,
      "pdf": pdf.asset->url,
      publish_status
    }`,
    { id }
  );
}