import { t, type Language } from '../i18n/translations';

type Item = { name: string; icon: any; color: string };

type Props = {
  language: Language;
  visibleSections: Set<string>;
  textPrimary: string;
  textSecondary: string;
  bgSkillsSection: string;
  bgCard: string;
  borderBase: string;
  activeTab: 'skills' | 'tools';
  setActiveTab: (tab: 'skills' | 'tools') => void;
  skills: Item[];
  tools: Item[];
};

export default function SkillsSection({
  language,
  visibleSections,
  textPrimary,
  textSecondary,
  bgSkillsSection,
  bgCard,
  borderBase,
  activeTab,
  setActiveTab,
  skills,
  tools,
}: Props) {
  return (
    <section id="skills" className={`pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 ${bgSkillsSection} ${visibleSections.has('skills') ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12 items-start">
          <div className={`lg:col-span-2 mb-8 lg:mb-0 ${visibleSections.has('skills') ? 'animate-fade-in-left' : 'opacity-0'}`}>
            <div className="mb-3 sm:mb-4">
              <span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>{t(language, 'skills.section')}</span>
              <div className="h-0.5 w-10 bg-orange-500 mt-2"></div>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight ${textPrimary}`}>
              {t(language, 'skills.heading1')}
              <br />
              <span className="text-orange-500">{t(language, 'skills.heading2')}</span>
            </h2>
            <p className={`${textSecondary} mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed`}>
              Specialized in building responsive, scalable applications using cutting-edge technologies and industry best practices.
            </p>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-5 py-2 rounded-md font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'skills' 
                    ? 'bg-orange-500 text-white scale-105' 
                    : `${bgCard} border ${borderBase} ${textPrimary} hover:border-orange-500 hover:scale-105`
                }`}
              >
                {t(language, 'skills.tab.skills')}
              </button>
              <button
                onClick={() => setActiveTab('tools')}
                className={`px-5 py-2 rounded-md font-semibold text-sm transition-all duration-300 ${
                  activeTab === 'tools' 
                    ? 'bg-orange-500 text-white scale-105' 
                    : `${bgCard} border ${borderBase} ${textPrimary} hover:border-orange-500 hover:scale-105`
                }`}
              >
                {t(language, 'skills.tab.tools')}
              </button>
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {(activeTab === 'skills' ? skills : tools).map((item, index) => (
              <div
                key={index}
                className={`${bgCard} rounded-lg p-4 border ${borderBase} transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:-translate-y-1 aspect-square flex flex-col items-center justify-center ${visibleSections.has('skills') ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <item.icon className={`${textPrimary} mb-2 transition-transform duration-300 group-hover:scale-110`} size={28} />
                <span className={`text-xs font-medium ${textPrimary} text-center leading-tight`}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


