  "use client";

  import { useState, useEffect } from "react";
  import FileUpload from "./FileUpload";
  import { createBook, updateBook, getBookById } from "@/lib/actions";

  export default function BookForm({ bookId, onSuccess }: { bookId?: string, onSuccess?: () => void }) {
    const [form, setForm] = useState({
      title: "",
      description: "",
      lang: "en",
      mrp_price: 0,
      offer_price: 0,
      amazon_link: "",
      flipkart_link: "",
      cover_front: "",
      cover_back: "",
      sample_pdf: "",
      publish_status: "draft",
    });

    useEffect(() => {
      if (bookId) {
        getBookById(bookId).then(b => setForm({ ...form, ...b }));
      }
    }, [bookId]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (bookId) await updateBook(bookId, form);
      else await createBook(form);
      onSuccess?.();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
        <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input input-bordered w-full" />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="textarea textarea-bordered w-full"></textarea>
        <select value={form.lang} onChange={e => setForm({...form, lang: e.target.value})} className="select select-bordered w-full">
          <option value="en">English</option>
          <option value="ta">Tamil</option>
        </select>
        <input type="number" placeholder="MRP Price" value={form.mrp_price} onChange={e => setForm({...form, mrp_price: Number(e.target.value)})} className="input input-bordered w-full" />
        <input type="number" placeholder="Offer Price" value={form.offer_price} onChange={e => setForm({...form, offer_price: Number(e.target.value)})} className="input input-bordered w-full" />
        <input type="url" placeholder="Amazon Link" value={form.amazon_link} onChange={e => setForm({...form, amazon_link: e.target.value})} className="input input-bordered w-full" />
        <input type="url" placeholder="Flipkart Link" value={form.flipkart_link} onChange={e => setForm({...form, flipkart_link: e.target.value})} className="input input-bordered w-full" />

        <label className="block">Cover Front</label>
        <FileUpload onUpload={id => setForm({...form, cover_front: id})} />
        <label className="block">Cover Back</label>
        <FileUpload onUpload={id => setForm({...form, cover_back: id})} />
        <label className="block">Sample PDF</label>
        <FileUpload onUpload={id => setForm({...form, sample_pdf: id})} />

        <select value={form.publish_status} onChange={e => setForm({...form, publish_status: e.target.value})} className="select select-bordered w-full">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <button type="submit" className="btn btn-primary w-full">Save</button>
      </form>
    );
  }
