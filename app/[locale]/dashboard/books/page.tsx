"use client";

import { useState, useEffect } from "react";
import { getBooks, deleteBook } from "@/lib/actions";
import BookForm from "@/components/sanity/BookForm";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editBookId, setEditBookId] = useState<string | null>(null);
  const limit = 10;

  const fetchBooks = async () => {
    setLoading(true);
    const res = await getBooks({ search, page, limit });
    setBooks(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, [search, page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    await deleteBook(id);
    fetchBooks();
  };

  const openEditForm = (id: string) => {
    setEditBookId(id);
    setShowForm(true);
  };

  const openAddForm = () => {
    setEditBookId(null);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Books Dashboard</h1>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered flex-1"
        />
        <button onClick={openAddForm} className="btn btn-primary">Add New Book</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Lang</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.author?.name || "—"}</td>
                  <td>{book.lang}</td>
                  <td>
                    {book.mrp_price}
                    {book.offer_price ? ` → ${book.offer_price}` : ""}
                  </td>
                  <td>{book.publish_status}</td>
                  <td className="flex gap-2">
                    <button onClick={() => openEditForm(book._id)} className="btn btn-sm btn-info">Edit</button>
                    <button onClick={() => handleDelete(book._id)} className="btn btn-sm btn-error">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          className="btn btn-outline"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>Page {page}</span>
        <button
          className="btn btn-outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={books.length < limit} // simple end check
        >
          Next
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-11/12 max-w-2xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 btn btn-sm btn-circle btn-ghost"
            >
              ✕
            </button>
            <BookForm
              bookId={editBookId || undefined}
              onSuccess={() => {
                setShowForm(false);
                fetchBooks();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
