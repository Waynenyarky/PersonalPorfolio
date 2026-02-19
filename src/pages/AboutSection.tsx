import { useState, useEffect, useRef } from 'react';
import formalImgDefault from '../assets/formal.png';
import { t, type Language } from '../i18n/translations';

type Stat = { icon: any; value: string; label: string; color: string };

function parseStatValue(value: string): { num: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)$/);
  if (match) return { num: parseInt(match[1], 10), suffix: match[2] || '' };
  return { num: 0, suffix: value };
}

type Props = {
  language: Language;
  visibleSections: Set<string>;
  textPrimary: string;
  textSecondary: string;
  bgSection: string;
  bgCard: string;
  borderBase: string;
  stats: Stat[];
  formalImg?: string;
  onViewResume: () => void;
  scrollToSection: (id: string) => void;
};

export default function AboutSection({
  language,
  visibleSections,
  textPrimary,
  textSecondary,
  bgSection,
  bgCard,
  borderBase,
  stats,
  formalImg,
  onViewResume,
  scrollToSection,
}: Props) {
  const imgSrc = formalImg || formalImgDefault;
  const [displayedNums, setDisplayedNums] = useState<number[]>(() => stats.map(() => 0));
  const hasAnimatedRef = useRef(false);
  const aboutVisible = visibleSections.has('about');

  useEffect(() => {
    if (!aboutVisible || hasAnimatedRef.current) return;
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const parsed = stats.map((s) => parseStatValue(s.value));
    const targets = parsed.map((p) => p.num);
    if (reducedMotion) {
      setDisplayedNums(targets);
      hasAnimatedRef.current = true;
      return;
    }
    const duration = 800;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const easeOut = 1 - (1 - t) * (1 - t);
      setDisplayedNums(targets.map((target) => Math.round(easeOut * target)));
      if (t < 1) requestAnimationFrame(tick);
      else hasAnimatedRef.current = true;
    };
    requestAnimationFrame(tick);
  }, [aboutVisible, stats]);

  const displayValues = stats.map((stat, i) => {
    const { suffix } = parseStatValue(stat.value);
    return `${displayedNums[i]}${suffix}`;
  });

  return (
    <section id="about" className={`pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 ${bgSection} ${visibleSections.has('about') ? 'animate-fade-in-up' : 'opacity-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
          {stats.map((stat, index) => {
            const delayClass = ['delay-0', 'delay-75', 'delay-150', 'delay-200', 'delay-300', 'delay-500'][Math.min(index, 5)];
            return (
            <div
              key={index}
              className={`${bgCard} rounded-lg p-6 border ${borderBase} transition-all duration-300 hover:border-orange-500 hover:shadow-lg hover:-translate-y-1 ${visibleSections.has('about') ? `animate-fade-in-up ${delayClass}` : 'opacity-0'}`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-110`}>
                  <stat.icon size={24} className="text-orange-500" />
                </div>
                <div>
                  <div className={`text-3xl font-bold mb-1 ${textPrimary}`}>{displayValues[index]}</div>
                  <div className={`${textSecondary} text-sm`}>{stat.label}</div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          <div className={`relative w-full max-w-md mx-auto lg:mx-0 mb-8 lg:mb-0 ${visibleSections.has('about') ? 'animate-fade-in-left' : 'opacity-0'}`}>
            <div className={`aspect-square ${bgCard} rounded-lg border ${borderBase} overflow-hidden transition-transform duration-500 hover:scale-105`}>
              <img src={imgSrc} alt="Profile" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
            </div>
          </div>

          <div className={`${visibleSections.has('about') ? 'animate-fade-in-right' : 'opacity-0'}`}>
            <div className="mb-3 sm:mb-4">
              <span className={`text-xs font-semibold tracking-wider uppercase ${textSecondary}`}>{t(language, 'about.section')}</span>
              <div className="h-0.5 w-10 bg-orange-500 mt-2"></div>
            </div>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight ${textPrimary}`}>
              {t(language, 'about.heading.line1')}
              <br />
              <span className="text-orange-500">{t(language, 'about.heading.line2')}</span>
            </h2>
            <p className={`${textSecondary} mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed`}>
              {t(language, 'about.p1')}
            </p>
            <p className={`${textSecondary} mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed`}>
              {t(language, 'about.p2')}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                {t(language, 'about.hireMe')}
              </button>
              <button
                type="button"
                onClick={onViewResume}
                className={`px-6 py-3 border ${borderBase} hover:border-orange-500 ${textPrimary} font-semibold rounded-lg transition-all duration-300 hover:scale-105`}
              >
                {t(language, 'about.downloadCV')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


