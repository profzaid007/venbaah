"use client";

import { useState } from "react";
import { sanity } from "@/lib/sanity";

export default function FileUpload({ onUpload }: { onUpload: (assetId: string) => void }) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setLoading(true);

    const asset = await sanity.assets.upload(file.type.startsWith("image/") ? "image" : "file", file, { filename: file.name });
    onUpload(asset._id);
    setLoading(false);
  };

  return (
    <input type="file" onChange={handleFileChange} disabled={loading} className="input input-bordered" />
  );
}
