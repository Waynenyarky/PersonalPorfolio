import { t, type Language } from '../i18n/translations';

type Props = {
  language: Language;
  visibleSections: Set<string>;
  textPrimary: string;
  textSecondary: string;
  bgSection: string;
  scrollToSection: (id: string) => void;
};

export default function CTASection({
  language,
  visibleSections,
  textPrimary,
  textSecondary,
  bgSection,
  scrollToSection,
}: Props) {
  return (
    <section id="cta" className={`pt-8 sm:pt-10 lg:pt-12 pb-10 sm:pb-12 lg:pb-16 ${bgSection} relative overflow-hidden ${visibleSections.has('cta') ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-linear-to-r from-orange-500/10 to-orange-600/10"></div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 ${textPrimary}`}>
          {t(language, 'cta.big.title')}
        </h2>
        <p className={`${textSecondary} mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto`}>
          {t(language, 'cta.big.subtitle')}
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
          <button
            onClick={() => scrollToSection('contact')}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            {t(language, 'cta.getStarted')}
          </button>
        </div>
      </div>
    </section>
  );
}


