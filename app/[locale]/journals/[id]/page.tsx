import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getJournalById } from '@/lib/actions';
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

export default async function JournalPage({ params }: PageProps) {
    const journal = await getJournalById(params.id);
    if (!journal) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="md:flex">
                    {/* Journal Cover */}
                    <div className="md:w-1/3 p-6 flex justify-center bg-gray-50">
                        <div className="relative w-full h-96">
                            {journal.cover_front ? (
                                <Image
                                    src={urlFor(journal.cover_front).url()}
                                    alt={journal.title}
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
                        </div>
                    </div>

                    {/* Journal Details */}
                    <div className="md:w-2/3 p-6 md:p-8">
                        <div className="flex flex-col h-full">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{journal.title}</h1>
                                
                                <div className="flex items-center mb-6">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                        {journal.lang.toUpperCase()}
                                    </span>
                                    <span className="ml-2 text-gray-600">
                                        {journal.month} {journal.year}
                                    </span>
                                </div>

                                {/* Description */}
                                {journal.description && (
                                    <div className="mb-8">
                                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                                        <p className="text-gray-700 whitespace-pre-line">{journal.description}</p>
                                    </div>
                                )}
                            </div>

                            {/* PDF Viewer */}
                            {journal.pdf && (
                                <div className="mt-auto pt-6 border-t border-gray-200">
                                    <h2 className="text-xl font-semibold mb-4">Journal Content</h2>
                                    <div className="w-full h-[1000px]">
                                        <iframe
                                            src={`${journal.pdf}#toolbar=0&navpanes=0&scrollbar=0`}
                                            width="100%"
                                            height="100%"
                                            className="border rounded-lg shadow-inner"
                                            title={`PDF Viewer - ${journal.title}`}
                                            style={{ border: 'none' }}
                                        />
                                    </div>
                                    {/* <div className="mt-4 flex justify-end">
                                        <a
                                            href={journal.pdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                            <span>Open in New Tab</span>
                                            <svg 
                                                className="w-4 h-4 ml-2" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24" 
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                                                />
                                            </svg>
                                        </a>
                                    </div> */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: PageProps) {
    const journal = await getJournalById(params.id);

    if (!journal) {
        return {
            title: 'Journal Not Found',
            description: 'The requested journal could not be found.'
        };
    }

    // Create a valid date string in YYYY-MM-DD format
    const getPublishedDate = () => {
        try {
            const year = journal.year || new Date().getFullYear();
            const month = journal.month ? new Date(`${journal.month} 1, 2000`).getMonth() + 1 : 1;
            return `${year}-${String(month).padStart(2, '0')}-01`;
        } catch (e) {
            // Fallback to current date if there's any error
            return new Date().toISOString().split('T')[0];
        }
    };

    return {
        title: `${journal.title} | Journal`,
        description: journal.description?.substring(0, 160) || `Read ${journal.title} from ${journal.month} ${journal.year}`,
        openGraph: {
            title: journal.title,
            description: journal.description?.substring(0, 300) || `Read ${journal.title}`,
            type: 'article',
            publishedTime: getPublishedDate(),
            images: journal.cover_front ? [journal.cover_front] : []
        }
    };
}