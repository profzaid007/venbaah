'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Journal, getJournals } from '@/lib/actions';
import imageUrlBuilder from '@sanity/image-url';
import { sanity } from '@/lib/sanity';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = imageUrlBuilder(sanity);

function urlFor(source: SanityImageSource) {
    return builder.image(source);
}

export default function TamilJournalsPage() {
    const [journals, setJournals] = useState<Journal[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 9; // 3x3 grid

    // Always use 'ta' for Tamil
    const lang = 'ta';

    const fetchJournals = async () => {
        setLoading(true);
        try {
            const result = await getJournals({
                search,
                page,
                limit,
                lang  // Always pass 'ta' for Tamil
            });
            setJournals(prev => page === 1 ? result : [...prev, ...result]);
            setHasMore(result.length === limit);
        } catch (error) {
            console.error('Error fetching Tamil journals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJournals();
    }, [page, search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    const loadMore = () => {
        setPage(prev => prev + 1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">தமிழ் இதழ்கள்</h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="தேடு இதழ்கள்..."
                        className="flex-1 p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        dir="rtl"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-l-md hover:bg-blue-700 transition-colors"
                    >
                        தேடு
                    </button>
                </div>
            </form>

            {loading && journals.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : journals.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">எந்தவொரு இதழ்களும் கிடைக்கவில்லை.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {journals.map((journal) => (
                            <Link
                                href={`/journals/${journal._id}?lang=${lang}`}
                                key={journal._id}
                                className="group"
                            >
                                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                                    {journal.cover_front && (
                                        <div className="relative h-48 w-full">
                                            <Image
                                                src={urlFor(journal.cover_front).url()}
                                                alt={journal.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4 flex-1">
                                        <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">
                                            {journal.title}
                                        </h2>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {journal.description}
                                        </p>
                                        <div className="mt-2 text-sm text-gray-500">
                                            {journal.month} {journal.year}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                                        <div className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                            வாசிக்க →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {hasMore && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={loadMore}
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'ஏற்றுகிறது...' : 'மேலும் ஏற்றவும்'}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}