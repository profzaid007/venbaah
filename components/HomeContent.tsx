import { useTranslations } from 'next-intl';

export default function HomeContent() {

    const t = useTranslations('home');
    return (
        <section className="text-gray-600 body-font">
  <div className="container px-5 py-10 mx-auto">
    <div className="flex flex-col text-center w-full mb-12">
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">{t('greetings')}</h1>
      <p className="lg:w-2/3 mx-auto leading-relaxed text-base">{t('greetingText')}</p>
    </div>
    <div className="flex flex-col text-center w-full mb-12">
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">{t('objectives')}</h1>
      <p className="lg:w-2/3 mx-auto leading-relaxed text-base">{t('objectiveText')}</p>
    </div><div className="flex flex-col text-center w-full mb-12">
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">{t('invitation')}</h1>
      <p className="lg:w-2/3 mx-auto leading-relaxed text-base">{t('invitationText')}</p>
    </div><div className="flex flex-col text-center w-full mb-12">
      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">{t('copyright')}</h1>
      <p className="lg:w-2/3 mx-auto leading-relaxed text-base">{t('copyrightText')}</p>
    </div>
  </div>
</section>
    );
}