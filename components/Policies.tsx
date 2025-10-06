import { useTranslations } from "next-intl";

export default function Policies() {
    const t = useTranslations('submissions');

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-">
                    <h2 className="text-xs text-red-500 tracking-widest font-medium title-font mb-1">{t('policies.title')}</h2>
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">{t('policies.sub-title')}</h1>
                    </div>
                    <div>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base"><span className="font-bold">{t('policies.publication')} : </span>{t('policies.publicationDesc')}</p>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base"><span className="font-bold">{t('policies.plagiarism')} : </span>{t('policies.plagiarismDesc')}</p>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base"><span className="font-bold">{t('policies.ethics')} : </span>{t('policies.ethicsDesc')}</p>
                </div>
            </div>
        </section>
    );
}