"use client";

import { useState, useEffect } from "react";
import { getJournals, deleteJournal } from "@/lib/actions";
import JournalForm from "@/components/sanity/JournalForm";

export default function AdminJournalsPage() {
  const [journals, setJournals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editJournalId, setEditJournalId] = useState<string | null>(null);
  const limit = 10;

  const fetchJournals = async () => {
    setLoading(true);
    const res = await getJournals({ search, page, limit });
    setJournals(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchJournals();
  }, [search, page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this journal?")) return;
    await deleteJournal(id);
    fetchJournals();
  };

  const openEditForm = (id: string) => {
    setEditJournalId(id);
    setShowForm(true);
  };

  const openAddForm = () => {
    setEditJournalId(null);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Journals Dashboard</h1>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered flex-1"
        />
        <button onClick={openAddForm} className="btn btn-primary">Add New Journal</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Lang</th>
                <th>Month</th>
                <th>Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {journals.map((j) => (
                <tr key={j._id}>
                  <td>{j.title}</td>
                  <td>{j.lang}</td>
                  <td>{j.month}</td>
                  <td>{j.year}</td>
                  <td>{j.publish_status}</td>
                  <td className="flex gap-2">
                    <button onClick={() => openEditForm(j._id)} className="btn btn-sm btn-info">Edit</button>
                    <button onClick={() => handleDelete(j._id)} className="btn btn-sm btn-error">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button className="btn btn-outline" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Prev
        </button>
        <span>Page {page}</span>
        <button className="btn btn-outline" onClick={() => setPage((p) => p + 1)} disabled={journals.length < limit}>
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
            <JournalForm
              journalId={editJournalId || undefined}
              onSuccess={() => {
                setShowForm(false);
                fetchJournals();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
