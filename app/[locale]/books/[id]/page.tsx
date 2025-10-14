import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getBookById } from '@/lib/actions';
import { sanity } from '@/lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Create the image URL builder
const builder = imageUrlBuilder(sanity);

function urlFor(source: SanityImageSource) {
    return builder.image(source);
}

interface PageProps {
    params: {
        id: string;
        locale: string;
    };
}

export default async function BookPage({ params }: PageProps) {
    const book = await getBookById(params.id);
    if (!book) {
        notFound();
    }

    // Format price with Indian Rupee symbol
    const formatPrice = (price?: number) => {
        return price ? `₹${price.toLocaleString('en-IN')}` : 'N/A';
    };

    // Calculate discount percentage if offer price is available
    const discount = book.offer_price && book.mrp_price && book.offer_price < book.mrp_price
        ? Math.round((1 - book.offer_price / book.mrp_price) * 100)
        : 0;

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="md:flex">
                    {/* Book Cover */}
                    <div className="md:w-1/3 p-6 flex justify-center bg-gray-50">
                        <div className="relative w-64 h-96 md:w-full md:max-w-xs">
                            {book.cover_front ? (
                                <Image
                                    src={urlFor(book.cover_front).url()}
                                    alt={book.title}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <span className="text-gray-400">No cover available</span>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                                    {discount}% OFF
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="md:w-2/3 p-6 md:p-8">
                        <div className="flex flex-col h-full">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>

                                {book.author && (
                                    <div className="flex items-center mb-4">
                                        {book.author.profile_pic && (
                                            <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                                <Image
                                                    src={urlFor(book.author.profile_pic).url()}
                                                    alt={book.author.name ?? 'Author profile picture'}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-600">Author</p>
                                            <p

                                                className="text-blue-600 font-medium"
                                            >
                                                {book.author.name}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center mb-6">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                        {book.lang.toUpperCase()}
                                    </span>
                                </div>

                                {/* Price Section */}
                                <div className="mb-6">
                                    {book.offer_price ? (
                                        <div className="flex items-baseline">
                                            <span className="text-3xl font-bold text-gray-900">
                                                {formatPrice(book.offer_price)}
                                            </span>
                                            {book.mrp_price && book.offer_price < book.mrp_price && (
                                                <>
                                                    <span className="ml-2 text-lg text-gray-500 line-through">
                                                        {formatPrice(book.mrp_price)}
                                                    </span>
                                                    <span className="ml-2 text-sm text-green-600 font-medium">
                                                        Save {formatPrice(book.mrp_price - book.offer_price)} ({discount}%)
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    ) : book.mrp_price ? (
                                        <span className="text-3xl font-bold text-gray-900">
                                            {formatPrice(book.mrp_price)}
                                        </span>
                                    ) : null}
                                </div>

                                {/* Description */}
                                {book.description && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                                        <p className="text-gray-700 whitespace-pre-line">{book.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto pt-6 border-t border-gray-200">
                                <div className="flex flex-wrap gap-4">
                                    {book.amazon_link && (
                                        <a
                                            href={book.amazon_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span>Buy on Amazon</span>
                                            <span className="text-lg">→</span>
                                        </a>
                                    )}

                                    {book.flipkart_link && (
                                        <a
                                            href={book.flipkart_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg text-center transition-colors flex items-center justify-center gap-2"
                                        >
                                            <span>Buy on Flipkart</span>
                                            <span className="text-lg">→</span>
                                        </a>
                                    )}
                                </div>
                                {book.sample_pdf && (
                                    <div className="mt-4">
                                        <h4 className="text-lg font-semibold mb-2">Sample Preview</h4>

                                        

                                        {/* OPTION 1: Direct iFrame (Recommended for modern browsers) */}
                                        <iframe
                                            // The 'toolbar=0&navpanes=0&scrollbar=0' attempts to hide controls, 
                                            // but is browser/PDF-viewer dependent.
                                            src={`${book.sample_pdf}#toolbar=0&navpanes=0&scrollbar=0`}
                                            width="100%"
                                            height="500px" // Adjust height as needed
                                            className="border rounded-lg shadow-inner"
                                            title={`Sample PDF for ${book.title}`}
                                            style={{ border: 'none' }} // Remove standard iframe border
                                        >
                                            <p>Your browser does not support PDF embedding. <a href={urlFor(book.sample_pdf).url()} target="_blank" rel="noopener noreferrer">View PDF</a></p>
                                        </iframe>

                                        {/* OPTIONAL: If the direct iframe doesn't work well, you can use Google Viewer:
            <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(book.sample_pdf)}&embedded=true`}
                width="100%"
                height="500px"
                className="border rounded-lg shadow-inner"
                title={`Sample PDF for ${book.title}`}
            >
            </iframe>
        */}

                                        {/* You may still want to offer a link in case the iframe fails */}
                                        <p className="text-sm text-gray-500 mt-2">
                                            *PDF is displayed in a viewer. If not visible, please try viewing it directly:
                                            <a href={urlFor(book.sample_pdf).url()} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline ml-1">View PDF</a>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Cover (if available) */}
                {book.cover_back && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <h2 className="text-xl font-semibold mb-4">Back Cover</h2>
                        <div className="flex justify-center">
                            <div className="relative w-64 h-96">
                                <Image
                                    src={urlFor(book.cover_back).url()}
                                    alt={`${book.title} - Back Cover`}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Related Books by Same Author
            {book.author?.books && book.author.books.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">More by {book.author.name}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {book.author.books
                            .filter(b => b._id !== book._id) // Exclude current book
                            .slice(0, 3) // Show max 3 books
                            .map(relatedBook => (
                                <Link
                                    key={relatedBook._id}
                                    href={`/books/${relatedBook._id}`}
                                    className="group block overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="relative aspect-[2/3] bg-gray-100">
                                        {relatedBook.cover_front ? (
                                            <Image
                                                src={relatedBook.cover_front}
                                                alt={relatedBook.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                                <span className="text-gray-400">No cover</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-600 line-clamp-2">
                                            {relatedBook.title}
                                        </h3>
                                        <div className="flex justify-between items-center mt-2">
                                            {relatedBook.offer_price ? (
                                                <span className="font-bold">{formatPrice(relatedBook.offer_price)}</span>
                                            ) : relatedBook.mrp_price ? (
                                                <span className="font-bold">{formatPrice(relatedBook.mrp_price)}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            )} */}
        </div>
    );
}

export async function generateMetadata({ params }: PageProps) {
    const book = await getBookById(params.id);

    if (!book) {
        return {
            title: 'Book Not Found',
            description: 'The requested book could not be found.'
        };
    }

    return {
        title: `${book.title} | ${book.author?.name || 'Book Details'}`,
        description: book.description?.substring(0, 160) || `Check out ${book.title} by ${book.author?.name || 'our author'}`,
        openGraph: {
            title: book.title,
            description: book.description?.substring(0, 300) || `Check out ${book.title}`,
            type: 'book',
            authors: book.author?.name ? [book.author.name] : [],
            images: book.cover_front ? [book.cover_front] : []
        }
    };
}
