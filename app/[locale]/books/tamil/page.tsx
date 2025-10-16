'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Book, getBooks } from '@/lib/actions';
import imageUrlBuilder from '@sanity/image-url';
import { sanity } from '@/lib/sanity';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import { useTranslations } from 'next-intl';
// Create the image URL builder
const builder = imageUrlBuilder(sanity);

function urlFor(source: SanityImageSource) {
    return builder.image(source);
}

export default function TamilBooksPage() {
    const searchParams = useSearchParams();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const limit = 9; // 3x3 grid
    const t = useTranslations('books');
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const result = await getBooks({
                search,
                page,
                limit,
                lang: 'ta' // Force Tamil language
            });
            setBooks(prev => page === 1 ? result : [...prev, ...result]);
            setHasMore(result.length === limit);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [page, search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1); // Reset to first page on new search
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">{t('tamilBooks')}</h1>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="flex gap-2 max-w-2xl mx-auto">
                    <input
                        type="text"
                        placeholder={t("searchBooks")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={loading}
                    >
                        {loading ? t('searching') : t('search')}
                    </button>
                </div>
            </form>

            {/* Books Grid */}
            {loading && page === 1 ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2">{t('searching')}</p>
                </div>
            ) : books.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">{t('noBooksFound')}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {books.map((book) => (
                            <Link
                                href={`/books/${book._id}`}
                                key={book._id}
                                className="group block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="relative aspect-[2/3] bg-gray-100">
                                    {book.cover_front ? (
                                        <Image
                                            src={urlFor(book.cover_front).url()}
                                            alt={book.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <span className="text-gray-400">{t('noCover')}</span>
                                        </div>
                                    )}
                                    {book.offer_price && book.mrp_price && book.offer_price < book.mrp_price && (
                                        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                            {Math.round((1 - book.offer_price / book.mrp_price) * 100)}% {t('discount')}
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 line-clamp-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                        {book.author?.name}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                        <div>
                                            {book.offer_price ? (
                                                <>
                                                    <span className="text-lg font-bold">₹{book.offer_price}</span>
                                                    {book.mrp_price && book.offer_price < book.mrp_price && (
                                                        <span className="ml-2 text-sm text-gray-500 line-through">₹{book.mrp_price}</span>
                                                    )}
                                                </>
                                            ) : book.mrp_price ? (
                                                <span className="text-lg font-bold">₹{book.mrp_price}</span>
                                            ) : null}
                                        </div>
                                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                            தமிழ்
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && !loading && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={() => setPage(p => p + 1)}
                                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'ஏற்றுகிறது...' : 'மேலும் ஏற்று'}
                            </button>
                        </div>
                    )}

                    {loading && page > 1 && (
                        <div className="text-center py-4">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}