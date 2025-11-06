import { t, type Language } from '../i18n/translations';
import { CheckCircle } from 'lucide-react';

type Props = {
  language: Language;
  visibleSections: Set<string>;
  textPrimary: string;
  textSecondary: string;
  bgSkillsSection: string;
  bgCard: string;
  borderBase: string;
  scrollToSection: (id: string) => void;
};

export default function EngagementSection({
  language,
  visibleSections,
  textPrimary,
  textSecondary,
  bgSkillsSection,
  bgCard,
  borderBase,
  scrollToSection,
}: Props) {
  return (
    <section id="engagement" className={`pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 ${bgSkillsSection} ${visibleSections.has('engagement') ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-start">
          <div className={`${bgCard} border ${borderBase} rounded-lg p-4 sm:p-6`}>
            <div className="mb-3 sm:mb-4">
              <span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>{t(language, 'engagement.process')}</span>
              <div className="h-0.5 w-10 bg-orange-500 mt-2"></div>
            </div>
            <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${textPrimary}`}>{t(language, 'engagement.howWeWork')}</h3>
            <ol className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${textSecondary} mb-4 sm:mb-6`}>
              <li className={`${textSecondary}`}>{t(language, 'engagement.step1')}</li>
              <li className={`${textSecondary}`}>{t(language, 'engagement.step2')}</li>
              <li className={`${textSecondary}`}>{t(language, 'engagement.step3')}</li>
              <li className={`${textSecondary}`}>{t(language, 'engagement.step4')}</li>
            </ol>
            <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => scrollToSection('contact')}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {t(language, 'engagement.bookCall')}
              </button>
              <a
                href="mailto:joma.enrique.up@phinmaed.com"
                className={`px-6 py-2 border ${borderBase} hover:border-orange-500 ${textPrimary} font-semibold rounded-lg transition-colors`}
              >
                {t(language, 'engagement.emailMe')}
              </a>
            </div>
          </div>

          <div className={`${bgCard} border ${borderBase} rounded-lg p-4 sm:p-6`}>
            <div className="mb-3 sm:mb-4">
              <span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>Engagement</span>
              <div className="h-0.5 w-10 bg-orange-500 mt-2"></div>
            </div>
            <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${textPrimary}`}>{t(language, 'engagement.title')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className={`bg-white/0 border ${borderBase} rounded-lg p-4`}>
                <h4 className={`font-semibold mb-1 ${textPrimary}`}>{t(language, 'engagement.fixed')}</h4>
                <p className={`${textSecondary} text-sm`}>Clear scope and timeline; ideal for well-defined projects.</p>
              </div>
              <div className={`bg-white/0 border ${borderBase} rounded-lg p-4`}>
                <h4 className={`font-semibold mb-1 ${textPrimary}`}>{t(language, 'engagement.hourly')}</h4>
                <p className={`${textSecondary} text-sm`}>Flexible ongoing work, billed monthly for actual hours.</p>
              </div>
              <div className={`bg-white/0 border ${borderBase} rounded-lg p-4`}>
                <h4 className={`font-semibold mb-1 ${textPrimary}`}>{t(language, 'engagement.retainer')}</h4>
                <p className={`${textSecondary} text-sm`}>Guaranteed availability for continuous improvements.</p>
              </div>
              <div className={`bg-white/0 border ${borderBase} rounded-lg p-4`}>
                <h4 className={`font-semibold mb-1 ${textPrimary}`}>{t(language, 'engagement.consulting')}</h4>
                <p className={`${textSecondary} text-sm`}>Architecture, audits, and roadmap planning.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


