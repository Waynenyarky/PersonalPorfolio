import SectionHeader from '../components/SectionHeader';
import { t, type Language } from '../i18n/translations';
import { projects as allProjects } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import ProfessionalDropdown from '../components/ProfessionalDropdown';
import { Briefcase } from 'lucide-react';

type Props = {
  language: Language;
  visibleSections: Set<string>;
  textPrimary: string;
  textSecondary: string;
  bgSection: string;
  bgCard: string;
  borderBase: string;
  inputBg: string;
  filterCategory: string;
  setFilterCategory: (v: string) => void;
  filterTech: string;
  setFilterTech: (v: string) => void;
  onSelectProject: (p: any) => void;
};

export default function PortfolioSection({
  language,
  visibleSections,
  textPrimary,
  textSecondary,
  bgSection,
  bgCard,
  borderBase,
  inputBg,
  filterCategory,
  setFilterCategory,
  filterTech,
  setFilterTech,
  onSelectProject,
}: Props) {
  const projects = allProjects;
  const filteredProjects = projects
    .filter((p) => !filterCategory || p.category === filterCategory)
    .filter((p) => {
      if (!filterTech) return true;
      const q = filterTech.toLowerCase();
      return p.tech.toLowerCase().includes(q) || p.title.toLowerCase().includes(q);
    });
  const hasMoreThanSix = filteredProjects.length > 6;

  return (
    <section id="portfolio" className={`pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 ${bgSection} ${visibleSections.has('portfolio') ? 'animate-fade-in-up' : 'opacity-0'} overflow-visible`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-visible">
        <div className={`${visibleSections.has('portfolio') ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <SectionHeader
            label={t(language, 'portfolio.section')}
            title={<><span className={`${textPrimary}`}>{t(language, 'portfolio.heading1')} </span><span className="text-orange-500">{t(language, 'portfolio.heading2')}</span></>}
            subtitle={t(language, 'portfolio.subtitle')}
            align="center"
            textPrimaryClass={textPrimary}
            textSecondaryClass={textSecondary}
          />
        </div>

        <div className={`mb-6 ${bgCard} border ${borderBase} rounded-lg p-3 sm:p-4 transition-all duration-300 ${visibleSections.has('portfolio') ? 'animate-fade-in-up' : 'opacity-0'} overflow-visible`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 relative flex-1 sm:flex-none">
              <label className={`text-xs whitespace-nowrap ${textSecondary}`}>{t(language, 'portfolio.filter.category')}</label>
              <div className="min-w-[180px]">
                <ProfessionalDropdown
                  name="portfolioCategory"
                  value={filterCategory}
                  onChange={(val) => setFilterCategory(val)}
                  options={[
                    { value: '', label: t(language, 'portfolio.filter.all') },
                    ...[...new Set(projects.map(p => p.category))].map((cat) => ({ value: cat, label: cat }))
                  ]}
                  inputBg={inputBg}
                  borderBase={borderBase}
                  textPrimary={textPrimary}
                  textSecondary={textSecondary}
                  leftIcon={filterCategory ? <Briefcase className={textSecondary} size={18} /> : undefined}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <label className={`text-xs whitespace-nowrap ${textSecondary}`}>{t(language, 'portfolio.filter.tech')}</label>
              <input
                type="text"
                value={filterTech}
                onChange={(e) => setFilterTech(e.target.value)}
                placeholder={t(language, 'portfolio.filter.placeholder')}
                className={`flex-1 sm:w-[220px] ${inputBg} border ${borderBase} ${textPrimary} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 hover:border-orange-500/60`}
              />
              {(filterCategory || filterTech) && (
                <button
                  onClick={() => { setFilterCategory(''); setFilterTech(''); }}
                  className={`shrink-0 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border ${borderBase} hover:border-orange-500 ${textPrimary} bg-transparent hover:bg-orange-500/10 transition-all duration-200 active:scale-[0.98] whitespace-nowrap`}
                  aria-label="Clear filters"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="relative">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 ${
              hasMoreThanSix ? 'projects-scrollable overflow-y-auto pb-4' : ''
            }`}
          >
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                bgCardClass={bgCard}
                borderBaseClass={borderBase}
                textPrimaryClass={textPrimary}
                textSecondaryClass={textSecondary}
                visible={visibleSections.has('portfolio')}
                onSelect={onSelectProject}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


