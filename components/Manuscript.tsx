import { useTranslations } from "next-intl";

export default function Manuscript() {
    const t = useTranslations('submissions');

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-">
                    <h2 className="text-xs text-red-500 tracking-widest font-medium title-font mb-1">{t('manuscriptGuidelines.title')}</h2>
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">{t('manuscriptGuidelines.sub-title')}</h1>
                    </div>
                    <div>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base"><span className="font-bold">{t('manuscriptGuidelines.language')} : </span>{t('manuscriptGuidelines.tamilOrEnglish')}</p>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base"><span className="font-bold">{t('manuscriptGuidelines.articleSize')} : </span>{t('manuscriptGuidelines.articleSizeDesc')}</p>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base"><span className="font-bold">{t('manuscriptGuidelines.arcticleTitle')} : </span>{t('manuscriptGuidelines.articleDesc')}</p>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base"><span className="font-bold">{t('manuscriptGuidelines.structure')} : </span>{t('manuscriptGuidelines.structureDesc')}</p>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base"><span className="font-bold">{t('manuscriptGuidelines.submissionMethod')} : </span>{t('manuscriptGuidelines.submissionMethodDesc')}</p>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base"><span className="font-bold">{t('manuscriptGuidelines.subscription')} : </span>{t('manuscriptGuidelines.subscriptionDesc')}</p>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base"><span className="font-bold">{t('manuscriptGuidelines.author')} : </span>{t('manuscriptGuidelines.authorDesc')}</p>
                </div>
            </div>
        </section>
    );
}