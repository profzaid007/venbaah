import { sanity } from "./sanity";

// ------------------ BOOKS ------------------

// Get books with pagination & search
export async function getBooks({ search = "", page = 1, limit = 10 } = {}) {
  const start = (page - 1) * limit;

  // If search is empty, just remove the `match` filter
  const query = search
    ? `*[_type == "book" && title match $search] | order(_createdAt desc) [${start}...${start + limit}]`
    : `*[_type == "book"] | order(_createdAt desc) [${start}...${start + limit}]`;

  // When using match, use *search* pattern (no quotes)
  const params = search ? { search: `*${search}*` } : {};
  const searchPattern = search.trim() ? `*${search.trim()}*` : undefined;
  return sanity.fetch(query, params);
}


// Get single book
export async function getBookById(id: string) {
  return sanity.getDocument(id);
}

// Create book
export async function createBook(data: any) {
  return sanity.create({
    _type: "book",
    ...data,
  });
}

// Update book
export async function updateBook(id: string, data: any) {
  return sanity.patch(id).set(data).commit();
}

// Delete book
export async function deleteBook(id: string) {
  return sanity.delete(id);
}

// ------------------ JOURNALS ------------------

// Get journals with pagination & search
export async function getJournals({ search = "", page = 1, limit = 10 } = {}) {
  const start = (page - 1) * limit;
  const trimmedSearch = search.trim();

  const query = trimmedSearch
    ? `*[_type == "journal" && title match $search] | order(_createdAt desc) [${start}...${start + limit}]`
    : `*[_type == "journal"] | order(_createdAt desc) [${start}...${start + limit}]`;

  const params = trimmedSearch ? { search: `*${trimmedSearch}*` } : {};
  return sanity.fetch(query, params);
}

// Get single journal
export async function getJournalById(id: string) {
  return sanity.getDocument(id);
}

// Create journal
export async function createJournal(data: any) {
  return sanity.create({
    _type: "journal",
    ...data,
  });
}

// Update journal
export async function updateJournal(id: string, data: any) {
  return sanity.patch(id).set(data).commit();
}

// Delete journal
export async function deleteJournal(id: string) {
  return sanity.delete(id);
}


// Create Author
export async function createAuthor(data: {
  name: string;
  bio?: string;
  profile_pic?: string; // ID from file upload
  publish_status?: "draft" | "published";
}) {
  const doc = {
    _type: "author",
    ...data,
    publish_status: data.publish_status || "draft",
  };
  return sanity.create(doc);
}

// Update Author
export async function updateAuthor(id: string, data: any) {
  return sanity.patch(id).set(data).commit();
}

// Get All Authors
export async function getAuthors({ publishedOnly = false } = {}) {
  const query = publishedOnly
    ? `*[_type == "author" && publish_status == "published"] | order(_createdAt desc)`
    : `*[_type == "author"] | order(_createdAt desc)`;
  return sanity.fetch(query);
}

// Get Author by ID
export async function getAuthorById(id: string) {
  const query = `*[_type=="author" && _id == $id][0]`;
  return sanity.fetch(query, { id });
}

// Toggle publish/unpublish
export async function toggleAuthorPublish(id: string, publish: boolean) {
  return sanity.patch(id).set({ publish_status: publish ? "published" : "draft" }).commit();
}