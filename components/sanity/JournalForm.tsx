"use client";

import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";
import { createJournal, updateJournal, getJournalById } from "@/lib/actions";

export default function JournalForm({ journalId, onSuccess }: { journalId?: string, onSuccess?: () => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    lang: "en",
    month: "",
    year: new Date().getFullYear(),
    pdf: "",
    publish_status: "draft",
  });

  useEffect(() => {
    if (journalId) {
      getJournalById(journalId).then(j => setForm({ ...form, ...j }));
    }
  }, [journalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (journalId) await updateJournal(journalId, form);
    else await createJournal(form);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({...form, title: e.target.value})}
        className="input input-bordered w-full"
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({...form, description: e.target.value})}
        className="textarea textarea-bordered w-full"
      />
      <select
        value={form.lang}
        onChange={e => setForm({...form, lang: e.target.value})}
        className="select select-bordered w-full"
      >
        <option value="en">English</option>
        <option value="ta">Tamil</option>
      </select>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Month"
          value={form.month}
          onChange={e => setForm({...form, month: e.target.value})}
          className="input input-bordered flex-1"
        />
        <input
          type="number"
          placeholder="Year"
          value={form.year}
          onChange={e => setForm({...form, year: Number(e.target.value)})}
          className="input input-bordered flex-1"
        />
      </div>

      <label className="block">PDF</label>
      <FileUpload onUpload={id => setForm({...form, pdf: id})} />

      <select
        value={form.publish_status}
        onChange={e => setForm({...form, publish_status: e.target.value})}
        className="select select-bordered w-full"
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
      </select>

      <button type="submit" className="btn btn-primary w-full">Save</button>
    </form>
  );
}
