import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';
import { t, type Language } from '../i18n/translations';

type Props = {
  language: Language;
  textPrimary: string;
  textSecondary: string;
  bgSection: string;
  borderBase: string;
  scrollToSection: (id: string) => void;
};

export default function SiteFooter({ language, textPrimary, textSecondary, bgSection, borderBase, scrollToSection }: Props) {
  return (
    <footer className={`${bgSection} py-8 sm:py-12 border-t ${borderBase}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div>
            <div className={`text-2xl font-bold tracking-tight mb-4 ${textPrimary}`}>
              Wayne<span className="text-orange-500">.</span>
            </div>
            <p className={`${textSecondary} text-xs sm:text-sm leading-relaxed`}>
              Full-stack developer specializing in creating exceptional digital experiences with modern technologies.
            </p>
          </div>
          <div>
            <h3 className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${textPrimary}`}>{t(language, 'footer.portfolio')}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { labelKey: 'nav.about', id: 'about' },
                { labelKey: 'nav.skills', id: 'skills' },
                { labelKey: 'nav.projects', id: 'portfolio' },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                    className={`${textSecondary} text-sm hover:text-orange-500 transition-colors duration-200`}
                  >
                    {t(language, item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${textPrimary}`}>{t(language, 'footer.services')}</h3>
            <ul className="space-y-1.5 sm:space-y-2">
              {[
                { labelKey: 'nav.services', id: 'services' },
                { labelKey: 'nav.reviews', id: 'reviews' },
              ].map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => { e.preventDefault(); scrollToSection(item.id); }}
                    className={`${textSecondary} text-sm hover:text-orange-500 transition-colors duration-200`}
                  >
                    {t(language, item.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={`font-semibold mb-3 sm:mb-4 text-sm sm:text-base ${textPrimary}`}>{t(language, 'footer.connect')}</h3>
            <div className="flex space-x-4">
              <a href="https://web.facebook.com/jowne.enrique.11" target="_blank" rel="noopener noreferrer" className={`${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110`} aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110`} aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110`} aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/Waynenyarky" target="_blank" rel="noopener noreferrer" className={`${textSecondary} hover:text-orange-500 transition-all duration-300 hover:scale-110`} aria-label="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className={`pt-6 sm:pt-8 border-t ${borderBase} text-center ${textSecondary} text-xs sm:text-sm`}>
          © 2025 <span className="text-orange-500 font-semibold">Wayne Enrique</span>. All rights reserved
        </div>
      </div>
    </footer>
  );
}


